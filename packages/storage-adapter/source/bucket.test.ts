import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";
import { StorageError } from "./errors/storage.error.js";

export function bucketTest(storageFn: () => StorageContract): void {
  describe("Bucket", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });

    describe("#read(bucketNames, transactionFn)", function () {
      context("when transaction in scope", function () {
        it("should run transaction", async function () {
          const result = await storage.read(["test"], async (transaction) => {
            transaction.bucket("test");
            return true;
          });
          expect(result).to.be.true;
        });
      });
      context("when transaction out of scope", function () {
        it("should throw error", async function () {
          try {
            await storage.read(["test"], async (transaction) => {
              transaction.bucket("test2");
            });
          } catch (error) {
            expect(error).to.be.instanceOf(StorageError);
          }
        });
      });
    });

    describe("#write(bucketNames, transactionFn)", function () {
      context("when transaction in scope", function () {
        it("should run transaction", async function () {
          const result = await storage.write(["test"], async (transaction) => {
            transaction.bucket("test");
            return true;
          });
          expect(result).to.be.true;
        });
      });
      context("when transaction out of scope", function () {
        it("should throw error", async function () {
          try {
            await storage.write(["test"], async (transaction) => {
              transaction.bucket("test2");
            });
          } catch (error) {
            expect(error).to.be.instanceOf(StorageError);
          }
        });
      });
    });
  });
}
