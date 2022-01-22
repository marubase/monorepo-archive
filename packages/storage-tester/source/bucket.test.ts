import { StorageContract, StorageError } from "@marubase/storage";
import { expect } from "chai";

export function bucketTest(storageFn: () => StorageContract): void {
  describe("Bucket", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });

    describe("#read(scope, transactionFn)", function () {
      context("when it is in scope", function () {
        it("should return true", async function () {
          const result = await storage.read(["test"], (transaction) => {
            transaction.bucket("test");
            return Promise.resolve(true);
          });
          expect(result).to.be.true;
        });
      });
      context("when it is out of scope", function () {
        it("should return true", async function () {
          try {
            await storage.read(["test"], (transaction) => {
              transaction.bucket("test2");
              return Promise.resolve(true);
            });
            throw new Error();
          } catch (error) {
            expect(error).to.be.an.instanceOf(StorageError);
          }
        });
      });
    });

    describe("#write(scope, transactionFn)", function () {
      context("when it is in scope", function () {
        it("should return true", async function () {
          const result = await storage.write(["test"], (transaction) => {
            transaction.bucket("test");
            return Promise.resolve(true);
          });
          expect(result).to.be.true;
        });
      });
      context("when it is out of scope", function () {
        it("should return true", async function () {
          try {
            await storage.write(["test"], (transaction) => {
              transaction.bucket("test2");
              return Promise.resolve(true);
            });
            throw new Error();
          } catch (error) {
            expect(error).to.be.an.instanceOf(StorageError);
          }
        });
      });
    });
  });
}
