import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";

export function concurrencyTest(storageFn: () => StorageContract): void {
  describe("Concurrency", function () {
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

    context("Concurrent counter", function () {
      it("should return the correct count", async function () {
        const increment = (delta: number): Promise<void> =>
          storage.write(["test"], async (transaction) => {
            const bucket = transaction.bucket("test");
            const count = ((await bucket.get("count")) as number) || 0;
            bucket.set("count", count + delta);
          });
        await Promise.all([increment(1), increment(2), increment(3)]);

        const count = await storage.read(["test"], async (transaction) => {
          return transaction.bucket("test").get("count");
        });
        expect(count).to.equal(6);
      });
    });
  });
}
