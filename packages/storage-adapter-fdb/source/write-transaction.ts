import { versionstamp } from "@marubase/collator";
import {
  ReadTransactionContract,
  StorageError,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage-adapter";
import { ReadTransaction } from "./read-transaction.js";

export class WriteTransaction
  extends ReadTransaction
  implements WriteTransactionContract
{
  public readonly versionstamp = versionstamp;

  public bucket(bucketName: string): WriteBucketContract {
    if (!(bucketName in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running write transaction in "${bucketName}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createWriteBucket(
      this._fdbTransaction.at(this._fdbDirectories[bucketName]),
      this._factory,
    );
  }

  public nextID(): number {
    return this._fdbTransaction.getNextTransactionID();
  }

  public snapshot(): ReadTransactionContract {
    return this._factory.createReadTransaction(
      this._fdbTransaction.snapshot(),
      this._fdbDirectories,
      this._factory,
    );
  }
}
