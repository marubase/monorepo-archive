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
  StorageError,
  StorageFactory,
} from "@marubase/storage-adapter";
import { Directory, Transaction } from "foundationdb";

export class ReadTransaction implements ReadTransactionContract {
  public readonly cast = {
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

  public readonly order = { asc, desc };

  protected _factory: StorageFactory;

  protected _fdbDirectories: Record<string, Directory>;

  protected _fdbTransaction: Transaction;

  public constructor(
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
    factory: StorageFactory,
  ) {
    this._fdbTransaction = fdbTransaction;
    this._fdbDirectories = fdbDirectories;
    this._factory = factory;
  }

  public bucket(bucketName: string): ReadBucketContract {
    if (!(bucketName in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running read transaction in "${bucketName}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createReadBucket(
      this._fdbTransaction.at(this._fdbDirectories[bucketName]),
      this._factory,
    );
  }
}
