import {
  ReadBucketInterface,
  ReadTransactionInterface,
  StorageError,
  StorageFactory,
  StorageInterface,
  TransactionCast,
  TransactionOrder,
} from "@marubase/storage";
import { Directory, Transaction } from "foundationdb";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";

export class ReadTransaction implements ReadTransactionInterface {
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly scope: string[];

  public readonly storage: StorageInterface;

  protected _fdbDirectories: Record<string, Directory>;

  protected _fdbTransaction: Transaction;

  public constructor(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._fdbTransaction = fdbTransaction;
    this._fdbDirectories = fdbDirectories;
  }

  public bucket<Key, Value>(name: string): ReadBucketInterface<Key, Value> {
    if (!(name in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running read transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this.factory.createReadBucket(
      this.factory,
      this,
      name,
      this._fdbTransaction,
    );
  }
}
