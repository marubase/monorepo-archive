import { versionstamp } from "@marubase/collator";
import { ReadTransactionContract } from "./read-transaction.contract.js";
import { WriteBucketContract } from "./write-bucket.contract.js";

export interface WriteTransactionContract extends ReadTransactionContract {
  readonly versionstamp: typeof versionstamp;

  bucket<Key, Value>(name: string): WriteBucketContract<Key, Value>;

  commitID?(): Promise<Buffer>;

  commitIDSync?(): Buffer;

  nextID(): number;

  snapshot(): ReadTransactionContract;
}
