import { StorageContract } from "@marubase/storage";
import {
  basicTest,
  bucketTest,
  concurrencyTest,
  rangeTest,
  transactionTest,
  versionstampTest,
} from "@marubase/storage-tester";
import { rm } from "node:fs/promises";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: StorageContract;
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
  bucketTest(() => storage);
  transactionTest(() => storage);
  rangeTest(() => storage);
  versionstampTest(() => storage);
  concurrencyTest(() => storage);
});
