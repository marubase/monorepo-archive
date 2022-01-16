import { ReadTransaction } from "./read-transaction.js";
import { WriteBucket } from "./write-bucket.js";

export class WriteTransaction extends ReadTransaction {
  public get nextID(): number {
    return this._fdbTransaction.getNextTransactionID();
  }

  public bucket(bucketName: string): WriteBucket {
    const fdbBucket = this._fdbBuckets[bucketName];
    const fdbTransaction = this._fdbTransaction.at(fdbBucket);
    return new WriteBucket(fdbTransaction);
  }

  public snapshot(): ReadTransaction {
    return new ReadTransaction(this._fdbBuckets, this._fdbTransaction);
  }
}
