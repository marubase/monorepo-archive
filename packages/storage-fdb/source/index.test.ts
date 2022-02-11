import {
  basicTest,
  boundTest,
  bucketTest,
  collationTest,
  concurrencyTest,
  rangeTest,
  transactionTest,
  versionstampTest,
  watchTest,
} from "@marubase-tools/storage-tester";
import { StorageInterface } from "@marubase/storage";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: StorageInterface;
  beforeEach(async function () {
    storage = await Storage.open();
  });
  afterEach(async function () {
    await storage.close();
  });

  basicTest(() => storage);
  collationTest(() => storage);
  bucketTest(() => storage);
  transactionTest(() => storage);
  rangeTest(() => storage);
  boundTest(() => storage);
  versionstampTest(() => storage);
  concurrencyTest(() => storage);
  watchTest(() => storage);
});
