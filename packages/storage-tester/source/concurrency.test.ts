import { StorageContract } from "@marubase/storage";
import { expect } from "chai";

export function concurrencyTest(storageFn: () => StorageContract): void {
  describe("Concurrency", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    describe("concurrently increase", function () {
      it("should run", async function () {
        const increase = (delta: number): Promise<void> =>
          storage.write("test", async (transaction) => {
            const current = (await transaction
              .bucket("test")
              .get("count", 0)) as number;
            const increased = current + delta;
            transaction.bucket("test").set("count", increased);
          });
        await Promise.all([increase(1), increase(2), increase(3)]);

        const count = await storage.bucket("test").get("count");
        expect(count).to.equal(6);
      });
    });
  });
}
