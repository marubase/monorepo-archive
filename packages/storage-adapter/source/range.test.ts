import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";

export function rangeTest(storageFn: () => StorageContract): void {
  describe("Range", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
      await storage.write(["test"], async (transaction) => {
        for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, true);
      });
    });
    afterEach(async function () {
      await storage.write(["test"], async (transaction) => {
        const { order } = transaction;
        transaction
          .bucket("test")
          .clearRange(order.asc(null), order.desc(null));
      });
    });

    describe("#getRange(start, end, { limit }", function () {
      it("should return range", async function () {
        const collection = await storage.read(["test"], async (transaction) => {
          const bucket = transaction.bucket("test");
          const start = null;
          const end = undefined;
          const options = { limit: 5 };
          const range: [unknown, unknown][] = [];
          for await (const entry of bucket.getRange(start, end, options))
            range.push(entry);
          return range;
        });
        expect(collection).to.deep.equal([
          [0, true],
          [1, true],
          [2, true],
          [3, true],
          [4, true],
        ]);
      });
    });

    describe("#getRange(start, end, { reverse }", function () {
      it("should return range", async function () {
        const collection = await storage.read(["test"], async (transaction) => {
          const bucket = transaction.bucket("test");
          const start = undefined;
          const end = null;
          const options = { reverse: true };
          const range: [unknown, unknown][] = [];
          for await (const entry of bucket.getRange(start, end, options))
            range.push(entry);
          return range;
        });
        expect(collection).to.deep.equal([
          [9, true],
          [8, true],
          [7, true],
          [6, true],
          [5, true],
          [4, true],
          [3, true],
          [2, true],
          [1, true],
          [0, true],
        ]);
      });
    });

    describe("#getRange(start, end, { limit, reverse }", function () {
      it("should return range", async function () {
        const collection = await storage.read(["test"], async (transaction) => {
          const bucket = transaction.bucket("test");
          const start = undefined;
          const end = null;
          const options = { limit: 5, reverse: true };
          const range: [unknown, unknown][] = [];
          for await (const entry of bucket.getRange(start, end, options))
            range.push(entry);
          return range;
        });
        expect(collection).to.deep.equal([
          [9, true],
          [8, true],
          [7, true],
          [6, true],
          [5, true],
        ]);
      });
    });
  });
}
