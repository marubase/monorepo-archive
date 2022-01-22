import { StorageContract, StorageError } from "@marubase/storage";
import { expect } from "chai";

export function versionstampTest(storageFn: () => StorageContract): void {
  describe("Versionstamp", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    describe("#clear(versionstamp)", function () {
      it("should clear value", async function () {
        await storage.bucket("test").clear(storage.versionstamp(0));

        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const values = await storage.bucket("test").getRange(start, end);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#clearRange(start, end)", function () {
      it("should clear values", async function () {
        await storage
          .bucket("test")
          .clearRange(storage.versionstamp(0), storage.versionstamp(10));

        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const values = await storage.bucket("test").getRange(start, end);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#get(versionstamp)", function () {
      it("should return value", async function () {
        const value = await storage.bucket("test").get(storage.versionstamp());
        expect(value).to.be.undefined;
      });
    });

    describe("#getRange(start, end)", function () {
      it("should return no values", async function () {
        const start = storage.order.asc(storage.versionstamp(0));
        const end = storage.order.desc(storage.versionstamp(10));
        const values = await storage.bucket("test").getRange(start, end);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#getRange(start, end, { limit })", function () {
      it("should return no values", async function () {
        const start = storage.order.asc(storage.versionstamp(0));
        const end = storage.order.desc(storage.versionstamp(10));
        const options = { limit: 5 };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#getRange(start, end, { reverse })", function () {
      it("should return no values", async function () {
        const start = storage.order.asc(storage.versionstamp(0));
        const end = storage.order.desc(storage.versionstamp(10));
        const options = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(end, start, options);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#getRange(start, end, { limit, reverse })", function () {
      it("should return no values", async function () {
        const start = storage.order.asc(storage.versionstamp(0));
        const end = storage.order.desc(storage.versionstamp(10));
        const options = { limit: 5 };
        const values = await storage
          .bucket("test")
          .getRange(end, start, options);
        expect(values).to.have.lengthOf(0);
      });
    });

    describe("#set(versionstamp, value)", function () {
      it("should set value", async function () {
        await storage.write("test", async (transaction) => {
          const txnID = transaction.nextID();
          transaction
            .bucket("test")
            .set(transaction.versionstamp(txnID), "value");
        });

        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const values = await storage.bucket("test").getRange(start, end);
        expect(values).to.have.lengthOf(1);
      });
    });

    describe("#set(key, versionstamp)", function () {
      it("should set versionstamp", async function () {
        await storage.bucket("test").set("key", storage.versionstamp());

        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const values = await storage.bucket("test").getRange(start, end);
        expect(values).to.have.lengthOf(1);
      });
    });

    describe("#set(versionstamp, versionstamp)", function () {
      it("should throw error", async function () {
        try {
          await storage
            .bucket("test")
            .set(storage.versionstamp(), storage.versionstamp());
          throw new Error();
        } catch (error) {
          expect(error).to.be.an.instanceOf(StorageError);
        }
      });
    });
  });
}
