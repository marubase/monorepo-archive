import { bucketTest } from "./bucket.test.js";
import { collationTest } from "./collation.test.js";
import { concurrencyTest } from "./concurrency.test.js";
import { StorageContract } from "./contracts/storage.contract.js";
import { rangeTest } from "./range.test.js";
import { transactionTest } from "./transaction.test.js";
import { versionstampTest } from "./versionstamp.test.js";

export function storageTest(storageFn: () => StorageContract): void {
  bucketTest(storageFn);
  concurrencyTest(storageFn);
  rangeTest(storageFn);
  transactionTest(storageFn);
  versionstampTest(storageFn);
  collationTest(storageFn);
}
