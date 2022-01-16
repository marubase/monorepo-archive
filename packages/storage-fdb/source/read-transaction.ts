import { Directory, Transaction } from "foundationdb";
import { ReadBucket } from "./read-bucket.js";

export class ReadTransaction {
  protected _fdbBuckets: Record<string, Directory>;

  protected _fdbTransaction: Transaction;

  public constructor(
    fdbBuckets: Record<string, Directory>,
    fdbTransaction: Transaction,
  ) {
    this._fdbBuckets = fdbBuckets;
    this._fdbTransaction = fdbTransaction;
  }

  public bucket(bucketName: string): ReadBucket {
    const fdbBucket = this._fdbBuckets[bucketName];
    const fdbTransaction = this._fdbTransaction.at(fdbBucket);
    return new ReadBucket(fdbTransaction);
  }
}
