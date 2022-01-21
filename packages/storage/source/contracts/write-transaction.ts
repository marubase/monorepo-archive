import { versionstamp } from "@marubase/collator";
import { ReadTransactionContract } from "./read-transaction.js";
import { WriteBucketContract } from "./write-bucket.js";

export interface WriteTransactionContract extends ReadTransactionContract {
  readonly versionstamp: typeof versionstamp;

  bucket(name: string): WriteBucketContract;

  commitID?(): Buffer;

  nextID(): number;
}