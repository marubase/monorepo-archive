import { ReadBucketContract } from "./read-bucket.contract.js";
import { WriteTransactionContract } from "./write-transaction.contract.js";

export interface WriteBucketContract<Key, Value>
  extends ReadBucketContract<Key, Value> {
  readonly transaction: WriteTransactionContract;

  clear(key: Key): void;

  clearRange(start: Key, end: Key): void;

  set(key: Key, value: Value): void;
}
