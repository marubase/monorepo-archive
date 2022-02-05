import { StorageContract } from "@marubase/storage";
import { expect } from "chai";

export function basicTest(storageFn: () => StorageContract): void {
  describe("Basic", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    describe("#bucket(name).clear(key)", function () {
      context("when there is value", function () {
        it("should clear value", async function () {
          await storage.bucket("test").set("key", "value");

          const value0 = await storage.bucket("test").get("key");
          expect(value0).to.equal("value");

          await storage.bucket("test").clear("key");

          const value1 = await storage.bucket("test").get("key");
          expect(value1).to.be.undefined;
        });
      });
      context("when there is no value", function () {
        it("should clear value", async function () {
          await storage.bucket("test").set("key", "value");

          const value0 = await storage.bucket("test").get("key");
          expect(value0).to.equal("value");

          await storage.bucket("test").clear("key");

          const value1 = await storage.bucket("test").get("key");
          expect(value1).to.be.undefined;
        });
      });
    });

    describe("#bucket(name).clearAndWatch(key)", function () {
      it("should resolve true", async function () {
        const watch = await storage.bucket("test").clearAndWatch("key");
        storage.bucket("test").set("key", "value");

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });

    describe("#bucket(name).clearRange(start, end)", function () {
      context("when there is values", function () {
        it("should clear values", async function () {
          await storage.write("test", async (transaction) => {
            for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, i);
          });

          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          const values0 = await storage.bucket("test").getRange(start, end);
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

          await storage.bucket("test").clearRange(start, end);

          const values1 = await storage.bucket("test").getRange(start, end);
          expect(values1).to.deep.equal([]);
        });
      });
      context("when there is no values", function () {
        it("should clear values", async function () {
          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          await storage.bucket("test").clearRange(start, end);

          const values1 = await storage.bucket("test").getRange(start, end);
          expect(values1).to.deep.equal([]);
        });
      });
    });

    describe("#bucket(name).get(key)", function () {
      context("when there is value", function () {
        it("should return value", async function () {
          await storage.bucket("test").set("key", "value");

          const value = await storage.bucket("test").get("key");
          expect(value).to.equal("value");
        });
      });
      context("when there is no value", function () {
        it("should return undefined", async function () {
          const value = await storage.bucket("test").get("key");
          expect(value).to.be.undefined;
        });
      });
    });

    describe("#bucket(name).getAndWatch(key)", function () {
      it("should resolve true", async function () {
        const watch = await storage.bucket("test").getAndWatch("key");
        expect(watch.value).to.be.undefined;

        storage.bucket("test").set("key", "update");

        const changed = await watch.promise;
        expect(changed).to.be.true;
        expect(watch.value).to.equal("update");
      });
    });

    describe("#bucket(name).getBinary(key)", function () {
      context("when there is value", function () {
        it("should return binary", async function () {
          await storage.bucket("test").set("key", "value");

          const value = await storage.bucket("test").getBinary("key");
          expect(value).to.deep.equal(
            Buffer.from([27, 118, 97, 108, 117, 101, 2]),
          );
        });
      });
      context("when there is no value", function () {
        it("should return undefined", async function () {
          const value = await storage.bucket("test").getBinary("key");
          expect(value).to.be.undefined;
        });
      });
    });

    describe("#bucket(name).getAndWatch(key).cancel()", function () {
      it("should resolve true", async function () {
        const watch = await storage.bucket("test").getAndWatch("key");
        expect(watch.value).to.be.undefined;

        setTimeout(() => watch.cancel(), 10);

        const changed = await watch.promise;
        expect(changed).to.be.false;
        expect(watch.value).to.be.undefined;
      });
    });

    describe("#bucket(name).getRange(start, end, options)", function () {
      context("when there is values", function () {
        it("should return values", async function () {
          await storage.write("test", async (transaction) => {
            for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, i);
          });

          const start = storage.order.asc(null);
          const end = storage.order.desc(null);
          const values = await storage.bucket("test").getRange(start, end);
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
          const values = await storage.bucket("test").getRange(start, end);
          expect(values).to.deep.equal([]);
        });
      });
    });

    describe("#bucket(name).set(key, value)", function () {
      context("when there is value", function () {
        it("should set value", async function () {
          await storage.bucket("test").set("key", "value");

          const values = await storage.bucket("test").get("key");
          expect(values).to.equal("value");

          await storage.bucket("test").set("key", "update");

          const value1 = await storage.bucket("test").get("key");
          expect(value1).to.equal("update");
        });
      });
      context("when there is no value", function () {
        it("should set value", async function () {
          await storage.bucket("test").set("key", "value");

          const values = await storage.bucket("test").get("key");
          expect(values).to.equal("value");
        });
      });
    });

    describe("#bucket(name).setAndWatch(key, value)", function () {
      it("should resolve true", async function () {
        const watch = await storage.bucket("test").setAndWatch("key", "value");
        storage.bucket("test").set("key", "update");

        const changed = await watch.promise;
        expect(changed).to.be.true;
      });
    });
  });
}
