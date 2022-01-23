import {
  ReadBucketContract,
  ReadTransactionContract,
  StorageContract,
  StorageError,
  StorageFactory,
  TransactionCast,
  TransactionOrder,
} from "@marubase/storage";
import { IDBPTransaction } from "idb/with-async-ittr";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";

export class ReadTransaction implements ReadTransactionContract {
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly scope: string[];

  public readonly storage: StorageContract;

  protected _idbTransaction: IDBPTransaction<unknown, string[], "readonly">;

  public constructor(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    idbTransaction: IDBPTransaction<unknown, string[], "readonly">,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._idbTransaction = idbTransaction;
  }

  public bucket<Key, Value>(name: string): ReadBucketContract<Key, Value> {
    if (this.scope.indexOf(name) < 0) {
      const scopes = this.scope.join(", ");
      const context = `Running read transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this.factory.createReadBucket(
      this.factory,
      this,
      name,
      this._idbTransaction.objectStore(name),
    );
  }
}
