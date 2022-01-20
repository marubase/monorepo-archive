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
import { Transaction } from "foundationdb";

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

  protected _bucketNames: string[];

  protected _factory: StorageFactory;

  protected _fdbTransaction: Transaction;

  public constructor(
    fdbTransaction: Transaction,
    bucketNames: string[],
    factory: StorageFactory,
  ) {
    this._fdbTransaction = fdbTransaction;
    this._bucketNames = bucketNames;
    this._factory = factory;
  }

  public bucket(bucketName: string): ReadBucketContract {
    if (this._bucketNames.indexOf(bucketName) < 0) {
      const scopes = this._bucketNames.join(", ");
      const context = `Running read transaction in "${bucketName}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createReadBucket(
      this._fdbTransaction,
      bucketName,
      this._factory,
    );
  }
}
