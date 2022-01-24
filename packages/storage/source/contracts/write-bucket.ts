import { ReadBucketContract } from "./read-bucket.js";
import { WriteTransactionContract } from "./write-transaction.js";

export interface WriteBucketContract<Key, Value>
  extends ReadBucketContract<Key, Value> {
  readonly mutations?: Promise<void>[];

  readonly transaction: WriteTransactionContract;

  clear(key: Key): void;

  clearRange(start: Key, end: Key): void;

  set(key: Key, value: Value): void;
}
