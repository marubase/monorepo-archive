import { StorageContract } from "@marubase/storage";
import { expect } from "chai";

export function transactionTest(storageFn: () => StorageContract): void {
  describe("Transaction", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    describe("#clear(key)", function () {
      context("when there is value", function () {
        it("should clear value", async function () {
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value0 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.equal("value");

          await storage.write("test", async (transaction) => {
            transaction.bucket("test").clear("key");
          });

          const value1 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.be.undefined;
        });
      });
      context("when there is no value", function () {
        it("should clear value", async function () {
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value0 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.equal("value");

          await storage.write("test", async (transaction) => {
            transaction.bucket("test").clear("key");
          });

          const value1 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.be.undefined;
        });
      });
    });

    describe("#clearRange(start, end)", function () {
      context("when there is values", function () {
        it("should clear values", async function () {
          await storage.write("test", async (transaction) => {
            for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, i);
          });

          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          const values0 = await storage.write("test", async (transaction) => {
            const collection: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(start, end))
              collection.push(entry);
            return collection;
          });
          expect(values0).to.deep.equal([
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
            [8, 8],
            [9, 9],
          ]);

          await storage.write("test", async (transaction) => {
            transaction.bucket("test").clearRange(start, end);
          });

          const values1 = await storage.write("test", async (transaction) => {
            const collection: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(start, end))
              collection.push(entry);
            return collection;
          });
          expect(values1).to.deep.equal([]);
        });
      });
      context("when there is no values", function () {
        it("should clear values", async function () {
          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").clearRange(start, end);
          });

          const values = await storage.write("test", async (transaction) => {
            const collection: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(start, end))
              collection.push(entry);
            return collection;
          });
          expect(values).to.deep.equal([]);
        });
      });
    });

    describe("#get(key)", function () {
      context("when there is value", function () {
        it("should return value", async function () {
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value = await storage.read("test", (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value).to.equal("value");
        });
      });
      context("when there is no value", function () {
        it("should return undefined", async function () {
          const value = await storage.read("test", (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value).to.be.undefined;
        });
      });
    });

    describe("#getRange(start, end, options)", function () {
      context("when there is values", function () {
        it("should return values", async function () {
          await storage.write("test", async (transaction) => {
            for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, i);
          });

          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          const values = await storage.read("test", async (transaction) => {
            const collection: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(start, end))
              collection.push(entry);
            return collection;
          });
          expect(values).to.deep.equal([
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
            [8, 8],
            [9, 9],
          ]);
        });
      });
      context("when there is no values", function () {
        it("should return no values", async function () {
          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          const values = await storage.read("test", async (transaction) => {
            const collection: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(start, end))
              collection.push(entry);
            return collection;
          });
          expect(values).to.deep.equal([]);
        });
      });
    });

    describe("#set(key, value)", function () {
      context("when there is value", function () {
        it("should set value", async function () {
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const values0 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(values0).to.equal("value");

          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "update");
          });

          const value1 = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.equal("update");
        });
      });
      context("when there is no value", function () {
        it("should set value", async function () {
          await storage.write("test", async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const values = await storage.write("test", async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(values).to.equal("value");
        });
      });
    });

    describe("#snapshot()", function () {
      it("should return snapshot", async function () {
        const result = await storage.write("test", async (transaction) => {
          transaction.snapshot();
          return true;
        });
        expect(result).to.be.true;
      });
    });
  });
}
