import { StorageContract } from "@marubase/storage";
import {
  basicTest,
  bucketTest,
  concurrencyTest,
  rangeTest,
  transactionTest,
  versionstampTest,
} from "@marubase/storage-tester";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: StorageContract;
  beforeEach(async function () {
    storage = await Storage.open();
  });
  afterEach(async function () {
    await storage.close();
  });

  basicTest(() => storage);
  bucketTest(() => storage);
  transactionTest(() => storage);
  rangeTest(() => storage);
  versionstampTest(() => storage);
  concurrencyTest(() => storage);
});
