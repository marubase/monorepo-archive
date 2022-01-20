import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";

export function transactionTest(storageFn: () => StorageContract): void {
  describe("Transaction", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      await storage.write(["test"], async (transaction) => {
        const { order } = transaction;
        transaction
          .bucket("test")
          .clearRange(order.asc(null), order.desc(null));
      });
    });

    describe("#clear(key)", function () {
      context("when there is value", function () {
        it("should clear value", async function () {
          await storage.write(["test"], async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value0 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.equal("value");

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").clear("key");
          });

          const value1 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.be.undefined;
        });
      });
      context("when there is no value", function () {
        it("should do nothing", async function () {
          const value0 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.be.undefined;

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").clear("key");
          });

          const value1 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.be.undefined;
        });
      });
    });

    describe("#clearRange(key)", function () {
      context("when there is values", function () {
        it("should clear values", async function () {
          await storage.write(["test"], async (transaction) => {
            for (let i = 0; i < 10; i++)
              transaction.bucket("test").set(i, true);
          });

          const range0 = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range0).to.have.lengthOf(10);

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").clearRange(0, 10);
          });

          const range1 = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range1).to.have.lengthOf(0);
        });
      });
      context("when there is no values", function () {
        it("should do nothing", async function () {
          const range0 = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range0).to.have.lengthOf(0);

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").clearRange(0, 10);
          });

          const range1 = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range1).to.have.lengthOf(0);
        });
      });
    });

    describe("#get(key)", function () {
      context("when there is value", function () {
        it("should return value", async function () {
          await storage.write(["test"], async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value).to.equal("value");
        });
      });
      context("when there is no value", function () {
        it("should return undefined", async function () {
          const value = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value).to.be.undefined;
        });
      });
    });

    describe("#getRange(start, end, options)", function () {
      context("when there is values", function () {
        it("should return values", async function () {
          await storage.write(["test"], async (transaction) => {
            for (let i = 0; i < 10; i++)
              transaction.bucket("test").set(i, true);
          });

          const range = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range).to.have.lengthOf(10);
        });
      });
      context("when there is no values", function () {
        it("should return empty values", async function () {
          const range = await storage.read(["test"], async (transaction) => {
            const range: [unknown, unknown][] = [];
            for await (const entry of transaction
              .bucket("test")
              .getRange(0, 10))
              range.push(entry);
            return range;
          });
          expect(range).to.have.lengthOf(0);
        });
      });
    });

    describe("#set(key, value)", function () {
      context("when there is value", function () {
        it("should set value", async function () {
          await storage.write(["test"], async (transaction) => {
            transaction.bucket("test").set("key", "value");
          });

          const value0 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.equal("value");

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").set("key", "value2");
          });

          const value1 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.equal("value2");
        });
      });
      context("when there is no value", function () {
        it("should set value", async function () {
          const value0 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value0).to.be.undefined;

          await storage.write(["test"], async (transaction) => {
            return transaction.bucket("test").set("key", "value");
          });

          const value1 = await storage.read(["test"], async (transaction) => {
            return transaction.bucket("test").get("key");
          });
          expect(value1).to.equal("value");
        });
      });
    });

    describe("#snapshot()", function () {
      it("should return value", async function () {
        await storage.write(["test"], async (transaction) => {
          transaction.bucket("test").set("key", "value");
        });

        const value = await storage.write(["test"], async (transaction) => {
          const snapshot = transaction.snapshot();
          return snapshot.bucket("test").get("key");
        });
        expect(value).to.equal("value");
      });
    });
  });
}
