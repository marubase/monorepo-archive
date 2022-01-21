import { versionstamp } from "@marubase/collator";
import {
  StorageError,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { ReadTransaction } from "./read-transaction.js";

export class WriteTransaction
  extends ReadTransaction
  implements WriteTransactionContract
{
  public get versionstamp(): typeof versionstamp {
    return versionstamp;
  }

  public bucket(name: string): WriteBucketContract {
    if (!(name in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running read transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createWriteBucket(
      this._factory,
      this,
      name,
      this._fdbTransaction,
    );
  }

  public nextID(): number {
    return this._fdbTransaction.getNextTransactionID();
  }
}
