import {
  decode,
  encode,
  RangeOptions,
  StorageError,
  StorageFactory,
  StorageInterface,
  Watch,
  WatcherFn,
  WriteBucketInterface,
  WriteTransactionInterface,
} from "@marubase/storage";
import { Database, RangeOptions as LMDBRangeOptions } from "lmdb";

export class WriteBucket<Key, Value>
  implements WriteBucketInterface<Key, Value>
{
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: WriteTransactionInterface;

  public readonly watchers: WatcherFn[] = [];

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionInterface,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._lmdbDatabase = lmdbDatabase;
  }

  public clear(key: Key): void {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._lmdbDatabase.remove(lmdbKey);
  }

  public clearRange(start: Key, end: Key): void {
    const lmdbOptions: LMDBRangeOptions = {};
    const encodedStart = encode([this.name, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this.name, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    this._lmdbDatabase
      .getRange(lmdbOptions)
      .forEach(({ key: lmdbKey }) => this._lmdbDatabase.remove(lmdbKey));
  }

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    const lmdbValue = await this.getBinary(key);
    return typeof lmdbValue !== "undefined"
      ? (decode(lmdbValue) as Value)
      : defaultValue;
  }

  public async getBinary(key: Key): Promise<Buffer | undefined> {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    return this._lmdbDatabase.getBinary(lmdbKey);
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
    const lmdbOptions = Object.assign({}, options) as LMDBRangeOptions;
    if (typeof lmdbOptions.limit !== "number") lmdbOptions.limit = 1000;
    if (typeof lmdbOptions.reverse !== "boolean") lmdbOptions.reverse = false;

    const encodedStart = encode([this.name, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this.name, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;

    const lmdbRange = this._lmdbDatabase.getRange(lmdbOptions);
    return this.factory.createRangeIterable(lmdbRange);
  }

  public set(key: Key, value: Value): void {
    const encodedKey = encode([this.name, key]);
    const encodedValue = encode(value);
    if (!Buffer.isBuffer(encodedKey) && !Buffer.isBuffer(encodedValue)) {
      const context = `Inserting key and value entry.`;
      const problem = `Key and value is both versionstamp.`;
      const solution = `Please either use key or value as versionstamp and not both in an entry.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    if (!Buffer.isBuffer(encodedKey)) {
      const { buffer: lmdbKey, position } = encodedKey;
      lmdbKey.set(this.transaction.commitIDSync!(), position);
      const lmdbValue = encodedValue as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
    } else if (!Buffer.isBuffer(encodedValue)) {
      const { buffer: lmdbValue, position } = encodedValue;
      lmdbValue.set(this.transaction.commitIDSync!(), position);
      const lmdbKey = encodedKey as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
    } else {
      this._lmdbDatabase.put(encodedKey, encodedValue);
    }
  }

  public watch(key: Key): Watch {
    let _cancelled = false;
    const cancel = (): void => {
      _cancelled = true;
    };

    let _resolve: (value: PromiseLike<boolean> | boolean) => void;
    let _reject: (reason?: unknown) => void;
    const promise = new Promise<boolean>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    let _value: Value | undefined;
    const watcherFn = async (storage: StorageInterface): Promise<void> => {
      _value = await this.get(key);
      setTimeout(() => watcherPoll(storage), 16);
    };

    const watcherPoll = async (storage: StorageInterface): Promise<void> => {
      const poll = async (): Promise<boolean> => {
        while (!_cancelled) {
          await new Promise((resolve) => setTimeout(resolve, 16));
          const value = await storage.bucket<Key, Value>(this.name).get(key);
          if (Buffer.isBuffer(value) && Buffer.isBuffer(_value))
            if (value.compare(_value) !== 0) return true;
          if (value !== _value) return true;
        }
        return false;
      };
      poll().then(_resolve).catch(_reject);
    };

    this.watchers.push(watcherFn);
    return { cancel, promise };
  }
}
