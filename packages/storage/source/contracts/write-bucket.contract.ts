import { ReadBucketInterface } from "./read-bucket.contract.js";
import { WriteTransactionInterface } from "./write-transaction.contract.js";

export const WriteBucketContract = Symbol("WriteBucketContract");

export interface WriteBucketInterface<Key, Value>
  extends ReadBucketInterface<Key, Value> {
  readonly transaction: WriteTransactionInterface;

  clear(key: Key): void;

  clearRange(start: Key, end: Key): void;

  set(key: Key, value: Value): void;
}
