import { ReadBucketContract } from "./read-bucket.js";
import { WriteTransactionContract } from "./write-transaction.js";

export interface WriteBucketContract extends ReadBucketContract {
  readonly transaction: WriteTransactionContract;

  clear(key: unknown): void;

  clearRange(start: unknown, end: unknown): void;

  set(key: unknown, value: unknown): void;
}
