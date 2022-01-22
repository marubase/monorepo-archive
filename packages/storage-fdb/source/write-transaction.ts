import { versionstamp } from "@marubase/collator";
import {
  ReadTransactionContract,
  StorageError,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { ReadTransaction } from "./read-transaction.js";

export class WriteTransaction
  extends ReadTransaction
  implements WriteTransactionContract
{
  public readonly versionstamp: typeof versionstamp = versionstamp;

  public bucket<Key, Value>(name: string): WriteBucketContract<Key, Value> {
    if (!(name in this._fdbDirectories)) {
      const scopes = Object.keys(this._fdbDirectories).join(", ");
      const context = `Running write transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this.factory.createWriteBucket(
      this.factory,
      this,
      name,
      this._fdbTransaction,
    );
  }

  public nextID(): number {
    return this._fdbTransaction.getNextTransactionID();
  }

  public snapshot(): ReadTransactionContract {
    return this.factory.createReadTransaction(
      this.factory,
      this.storage,
      this.scope,
      this._fdbTransaction.snapshot(),
      this._fdbDirectories,
    );
  }
}
