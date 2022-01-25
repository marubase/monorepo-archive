import {
  ReadBucketContract,
  ReadTransactionContract,
  StorageContract,
  StorageError,
  StorageFactory,
  TransactionCast,
  TransactionOrder,
  WatcherFn,
} from "@marubase/storage";
import { Database } from "lmdb";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";

export class ReadTransaction implements ReadTransactionContract {
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly scope: string[];

  public readonly storage: StorageContract;

  protected _buckets: ReadBucketContract<unknown, unknown>[] = [];

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._lmdbDatabase = lmdbDatabase;
  }

  public get watchers(): WatcherFn[] {
    const toWatchers = (
      watchers: WatcherFn[],
      bucket: ReadBucketContract<unknown, unknown>,
    ): WatcherFn[] => watchers.concat(...(bucket.watchers as WatcherFn[]));
    return this._buckets.reduce(toWatchers, []);
  }

  public bucket<Key, Value>(name: string): ReadBucketContract<Key, Value> {
    if (this.scope.indexOf(name) < 0) {
      const scopes = this.scope.join(", ");
      const context = `Running read transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    const bucket = this.factory.createReadBucket<Key, Value>(
      this.factory,
      this,
      name,
      this._lmdbDatabase,
    );
    this._buckets.push(bucket);
    return bucket;
  }
}
