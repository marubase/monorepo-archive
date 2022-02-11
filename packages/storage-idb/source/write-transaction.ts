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
import { IDBPTransaction } from "idb/with-async-ittr";
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

  protected _idbTransaction: IDBPTransaction<unknown, string[], "readwrite">;

  protected _mutationCounter: Promise<Buffer>;

  protected _transactionID = 0;

  public constructor(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    idbTransaction: IDBPTransaction<unknown, string[], "readwrite">,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._idbTransaction = idbTransaction;

    this._mutationCounter = this._idbTransaction
      .objectStore("_meta")
      .get(MutationCounter.key)
      .then(
        (encodedCounterBinary) =>
          encodedCounterBinary ||
          Buffer.from("1a0000000000000000000003", "hex"),
      )
      .then((encodedCounterBinary) => {
        const counterBinary = decode(encodedCounterBinary) as Buffer;
        const counter = MutationCounter.toBigInt(counterBinary) + 1n;

        const reCounterBinary = MutationCounter.toBinary(counter);
        const reEncodedCounterBinary = encode(reCounterBinary) as Buffer;
        return this._idbTransaction
          .objectStore("_meta")
          .put(reEncodedCounterBinary, MutationCounter.key)
          .then(() => reCounterBinary);
      });
  }

  public get mutations(): Promise<void>[] {
    const toMutations = (
      mutations: Promise<void>[],
      bucket: WriteBucketInterface<unknown, unknown>,
    ): Promise<void>[] =>
      mutations.concat(...(bucket.mutations as Promise<void>[]));
    return this._buckets.reduce(toMutations, []);
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
      this._idbTransaction.objectStore(name),
    );
    this._buckets.push(bucket);
    return bucket;
  }

  public async commitID(): Promise<Buffer> {
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
      this._idbTransaction as unknown as IDBPTransaction<
        unknown,
        string[],
        "readonly"
      >,
    );
  }
}
