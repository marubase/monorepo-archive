import { VersionstampValue } from "@marubase/collator";
import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";
import { StorageError } from "./errors/storage.error.js";

export function versionstampTest(storageFn: () => StorageContract): void {
  describe("Versionstamp", function () {
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

    describe("#clear(versionstamp)", function () {
      it("should clear versionstamp", async function () {
        await storage.write(["test"], async (transaction) => {
          transaction.bucket("test").clear(transaction.versionstamp());
        });

        const range = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range).to.have.lengthOf(0);
      });
    });

    describe("#clearRange(versionstamp, versionstamp)", function () {
      it("should clear versionstamps", async function () {
        await storage.write(["test"], async (transaction) => {
          transaction
            .bucket("test")
            .clearRange(
              transaction.versionstamp(0),
              transaction.versionstamp(10),
            );
        });

        const range = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range).to.have.lengthOf(0);
      });
    });

    describe("#get(versionstamp)", function () {
      it("should return versionstamp", async function () {
        const value = await storage.read(["test"], async (transaction) => {
          return transaction.bucket("test").get(VersionstampValue.create(0));
        });
        expect(value).to.be.undefined;
      });
    });

    describe("#getRange(versionstamp, versionstamp)", function () {
      it("should return versionstamps", async function () {
        const range = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(
              VersionstampValue.create(0),
              VersionstampValue.create(10),
            ))
            range.push(entry);
          return range;
        });
        expect(range).to.have.lengthOf(0);
      });
    });

    describe("#getRange(versionstamp, versionstamp, { reverse })", function () {
      it("should return versionstamps", async function () {
        const range = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(
              VersionstampValue.create(10),
              VersionstampValue.create(0),
              { reverse: true },
            ))
            range.push(entry);
          return range;
        });
        expect(range).to.have.lengthOf(0);
      });
    });

    describe("#set(versionstamp, value)", function () {
      it("should set versionstamp", async function () {
        const range0 = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range0).to.have.lengthOf(0);

        await storage.write(["test"], async (transaction) => {
          transaction
            .bucket("test")
            .set(transaction.versionstamp(transaction.nextID()), true);
        });

        const range1 = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range1).to.have.lengthOf(1);
      });
    });

    describe("#set(key, versionstamp)", function () {
      it("should set versionstamp", async function () {
        const range0 = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range0).to.have.lengthOf(0);

        await storage.write(["test"], async (transaction) => {
          transaction.bucket("test").set("key", transaction.versionstamp());
        });

        const range1 = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range1).to.have.lengthOf(1);
      });
    });

    describe("#set(versionstamp, versionstamp)", function () {
      it("should throw error", async function () {
        const range0 = await storage.read(["test"], async (transaction) => {
          const range: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(null, undefined))
            range.push(entry);
          return range;
        });
        expect(range0).to.have.lengthOf(0);

        try {
          await storage.write(["test"], async (transaction) => {
            transaction
              .bucket("test")
              .set(transaction.versionstamp(), transaction.versionstamp());
          });
        } catch (error) {
          expect(error).to.be.an.instanceOf(StorageError);
        }
      });
    });
  });
}
