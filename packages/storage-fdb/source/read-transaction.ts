import {
  asc,
  desc,
  float32,
  float64,
  int16,
  int32,
  int64,
  int8,
  uint16,
  uint32,
  uint64,
  uint8,
} from "@marubase/collator";
import {
  ReadBucketContract,
  ReadTransactionContract,
  StorageContract,
  StorageError,
  StorageFactory,
  TransactionCast,
  TransactionOrder,
} from "@marubase/storage";
import { Directory, Transaction } from "foundationdb";

export class ReadTransaction implements ReadTransactionContract {
  protected _factory: StorageFactory;

  protected _fdbDirectories: Record<string, Directory>;

  protected _fdbTransaction: Transaction;

  protected _scope: string[];

  protected _storage: StorageContract;

  public constructor(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ) {
    this._factory = factory;
    this._storage = storage;
    this._scope = scope;
    this._fdbTransaction = fdbTransaction;
    this._fdbDirectories = fdbDirectories;
  }

  public get cast(): TransactionCast {
    return {
      float32,
      float64,
      int16,
      int32,
      int64,
      int8,
      uint16,
      uint32,
      uint64,
      uint8,
    };
  }

  public get order(): TransactionOrder {
    return { asc, desc };
  }

  public get scope(): string[] {
    return this._scope;
  }

  public get storage(): StorageContract {
    return this._storage;
  }

  public bucket(name: string): ReadBucketContract {
    if (!(name in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running read transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createReadBucket(
      this._factory,
      this,
      name,
      this._fdbTransaction,
    );
  }
}
