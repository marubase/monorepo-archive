import { StorageContract } from "@marubase/storage";
import { expect } from "chai";

export function watchTest(storageFn: () => StorageContract): void {
  describe("Watch", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    describe("#watch(key)", function () {
      it("should resolve true", async function () {
        const watch = await storage.read("test", async (transaction) => {
          return transaction.bucket("test").watch("key");
        });
        storage.bucket("test").set("key", "value");

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });

    describe("#watch(key) - Buffer", function () {
      it("should resolve true", async function () {
        await storage.bucket("test").set("key", Buffer.from([0]));

        const watch = await storage.read("test", async (transaction) => {
          return transaction.bucket("test").watch("key");
        });
        storage.bucket("test").set("key", Buffer.from([255]));

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });

    describe("#watch(key).cancel()", function () {
      it("should resolve true", async function () {
        const versionstamp = storage.versionstamp();
        const watch = await storage.read("test", async (transaction) => {
          return transaction.bucket("test").watch(versionstamp);
        });
        setTimeout(() => watch.cancel(), 10);

        const changed = await watch.promise;
        expect(changed).to.be.false;
      });
    });

    describe("#watch(key) - Write transaction", function () {
      it("should resolve true", async function () {
        const watch = await storage.write("test", async (transaction) => {
          return transaction.bucket("test").watch("key");
        });
        storage.bucket("test").set("key", "value");

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });

    describe("#watch(key).cancel() - Write transaction", function () {
      it("should resolve true", async function () {
        const versionstamp = storage.versionstamp();
        const watch = await storage.write("test", async (transaction) => {
          return transaction.bucket("test").watch(versionstamp);
        });
        setTimeout(() => watch.cancel(), 10);

        const changed = await watch.promise;
        expect(changed).to.be.false;
      });
    });

    describe("#watch(key) - Buffer, Write transaction", function () {
      it("should resolve true", async function () {
        await storage.bucket("test").set("key", Buffer.from([0]));

        const watch = await storage.write("test", async (transaction) => {
          return transaction.bucket("test").watch("key");
        });
        storage.bucket("test").set("key", Buffer.from([255]));

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });
  });
}
