import { versionstamp } from "@marubase/collator";
import { BucketReadContract } from "./bucket-read.contract.js";

export interface BucketWriteContract extends BucketReadContract {
  readonly versionstamp: typeof versionstamp;

  clear(key: unknown): void;

  clearRange(startKey: unknown, endKey: unknown): void;

  getNextID(): number;

  set(key: unknown, value: unknown): void;

  snapshot(): BucketReadContract;
}
