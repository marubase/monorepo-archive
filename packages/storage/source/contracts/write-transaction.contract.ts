import { versionstamp } from "@marubase/collator";
import { ReadTransactionInterface } from "./read-transaction.contract.js";
import { WriteBucketInterface } from "./write-bucket.contract.js";

export interface WriteTransactionInterface extends ReadTransactionInterface {
  readonly versionstamp: typeof versionstamp;

  bucket<Key, Value>(name: string): WriteBucketInterface<Key, Value>;

  commitID?(): Promise<Buffer>;

  commitIDSync?(): Buffer;

  nextID(): number;

  snapshot(): ReadTransactionInterface;
}
