import { StorageContract } from "@marubase/storage";
import {
  basicTest,
  boundTest,
  bucketTest,
  collationTest,
  concurrencyTest,
  rangeTest,
  transactionTest,
  versionstampTest,
} from "@marubase/storage-tester";
import { expect } from "chai";
import { Storage } from "./storage.js";

describe("Storage", function () {
  let storage: StorageContract;
  beforeEach(async function () {
    storage = await Storage.open("data");
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

  describe("StorageIDB", function () {
    context("when try to read a new scope", function () {
      it("should return true", async function () {
        const result = await storage.read(["test2"], (transaction) => {
          transaction.bucket("test2");
          return Promise.resolve(true);
        });
        expect(result).to.be.true;
      });
    });
  });
});
