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
import { rm } from "node:fs/promises";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: StorageInterface;
  beforeEach(async function () {
    storage = await Storage.open("data");
  });
  afterEach(async function () {
    await storage.close();
  });
  after(async function () {
    await rm("data", { force: true, recursive: true });
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
