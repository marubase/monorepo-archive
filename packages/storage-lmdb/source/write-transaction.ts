import {
  decode,
  encode,
  ReadTransactionInterface,
  StorageError,
  StorageFactory,
  StorageInterface,
  TransactionCast,
  TransactionOrder,
  versionstamp,
  WatcherFn,
  WriteBucketInterface,
  WriteTransactionInterface,
} from "@marubase/storage";
import { Database } from "lmdb";
import { MutationCounter } from "./mutation-counter.js";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";

export class WriteTransaction implements WriteTransactionInterface {
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly scope: string[];

  public readonly storage: StorageInterface;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _buckets: WriteBucketInterface<unknown, unknown>[] = [];

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  protected _mutationCounter: Buffer;

  protected _transactionID = 0;

  public constructor(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._lmdbDatabase = lmdbDatabase;

    const encodedCounterBinary =
      this._lmdbDatabase.get(MutationCounter.key) ||
      Buffer.from("1a0000000000000000000003", "hex");
    const counterBinary = decode(encodedCounterBinary) as Buffer;
    const counter = MutationCounter.toBigInt(counterBinary) + 1n;

    const reCounterBinary = MutationCounter.toBinary(counter);
    const reEncodedCounterBinary = encode(reCounterBinary) as Buffer;
    this._lmdbDatabase.put(MutationCounter.key, reEncodedCounterBinary);
    this._mutationCounter = reCounterBinary;
  }

  public get watchers(): WatcherFn[] {
    const toWatchers = (
      watchers: WatcherFn[],
      bucket: WriteBucketInterface<unknown, unknown>,
    ): WatcherFn[] => watchers.concat(...(bucket.watchers as WatcherFn[]));
    return this._buckets.reduce(toWatchers, []);
  }

  public bucket<Key, Value>(name: string): WriteBucketInterface<Key, Value> {
    if (this.scope.indexOf(name) < 0) {
      const scopes = this.scope.join(", ");
      const context = `Running write transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    const bucket = this.factory.createWriteBucket<Key, Value>(
      this.factory,
      this,
      name,
      this._lmdbDatabase,
    );
    this._buckets.push(bucket);
    return bucket;
  }

  public commitIDSync(): Buffer {
    return this._mutationCounter;
  }

  public nextID(): number {
    return this._transactionID++;
  }

  public snapshot(): ReadTransactionInterface {
    return this.factory.createReadTransaction(
      this.factory,
      this.storage,
      this.scope,
      this._lmdbDatabase,
    );
  }
}
