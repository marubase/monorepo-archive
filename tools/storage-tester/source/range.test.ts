import { StorageInterface } from "@marubase/storage";
import { expect } from "chai";

export function rangeTest(storageFn: () => StorageInterface): void {
  describe("Range", function () {
    let storage: StorageInterface;
    beforeEach(async function () {
      storage = storageFn();

      await storage.write("test", async (transaction) => {
        for (let i = 0; i < 10; i++) transaction.bucket("test").set(i, i);
      });
    });
    afterEach(async function () {
      const start = storage.order.asc(null);
      const end = storage.order.desc(null);
      await storage.bucket("test").clearRange(start, end);
    });

    describe("#getRange(start, end)", function () {
      it("should return range", async function () {
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

    describe("#getRange(start, end, { limit })", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { limit: 5 };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ]);
      });
    });

    describe("#getRange(start, end, { reverse })", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(end, start, options);
        expect(values).to.deep.equal([
          [9, 9],
          [8, 8],
          [7, 7],
          [6, 6],
          [5, 5],
          [4, 4],
          [3, 3],
          [2, 2],
          [1, 1],
          [0, 0],
        ]);
      });
    });

    describe("#getRange(start, end, { limit, reverse })", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { limit: 5, reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(end, start, options);
        expect(values).to.deep.equal([
          [9, 9],
          [8, 8],
          [7, 7],
          [6, 6],
          [5, 5],
        ]);
      });
    });

    describe("#getRange(start, end) - Write transaction", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const values = await storage.write("test", async (transaction) => {
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

    describe("#getRange(start, end, { limit }) - Write transaction", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { limit: 5 };
        const values = await storage.write("test", async (transaction) => {
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(start, end, options))
            collection.push(entry);
          return collection;
        });
        expect(values).to.deep.equal([
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ]);
      });
    });

    describe("#getRange(start, end, { reverse }) - Write transaction", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { reverse: true };
        const values = await storage.write("test", async (transaction) => {
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(end, start, options))
            collection.push(entry);
          return collection;
        });
        expect(values).to.deep.equal([
          [9, 9],
          [8, 8],
          [7, 7],
          [6, 6],
          [5, 5],
          [4, 4],
          [3, 3],
          [2, 2],
          [1, 1],
          [0, 0],
        ]);
      });
    });

    describe("#getRange(start, end, { limit, reverse }) - Write transaction", function () {
      it("should return range", async function () {
        const start = storage.order.asc(null);
        const end = storage.order.desc(null);
        const options = { limit: 5, reverse: true };
        const values = await storage.write("test", async (transaction) => {
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(end, start, options))
            collection.push(entry);
          return collection;
        });
        expect(values).to.deep.equal([
          [9, 9],
          [8, 8],
          [7, 7],
          [6, 6],
          [5, 5],
        ]);
      });
    });
  });
}
