import { RangeOptions, StorageInterface } from "@marubase/storage";
import { expect } from "chai";

export function boundTest(storageFn: () => StorageInterface): void {
  describe("Range Bound", function () {
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

    describe("#getRange(null, undefined)", function () {
      it("should return range", async function () {
        const start = null;
        const end = undefined;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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

    describe("#getRange(0, undefined)", function () {
      it("should return range", async function () {
        const start = 0;
        const end = undefined;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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

    describe("#getRange(null, 9)", function () {
      it("should return range", async function () {
        const start = null;
        const end = 9;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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
        ]);
      });
    });

    describe("#getRange(0, 9)", function () {
      it("should return range", async function () {
        const start = 0;
        const end = 9;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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
        ]);
      });
    });

    describe("#getRange(0, 5)", function () {
      it("should return range", async function () {
        const start = 0;
        const end = 5;
        const options: RangeOptions = {};
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

    describe("#getRange(3, 8)", function () {
      it("should return range", async function () {
        const start = 3;
        const end = 8;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
          [7, 7],
        ]);
      });
    });

    describe("#getRange(5, undefined)", function () {
      it("should return range", async function () {
        const start = 5;
        const end = undefined;
        const options: RangeOptions = {};
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [5, 5],
          [6, 6],
          [7, 7],
          [8, 8],
          [9, 9],
        ]);
      });
    });

    describe("#getRange(null, undefined, { limit: 3 })", function () {
      it("should return range", async function () {
        const start = null;
        const end = undefined;
        const options: RangeOptions = { limit: 3 };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [0, 0],
          [1, 1],
          [2, 2],
        ]);
      });
    });

    describe("#getRange(undefined, null, { reverse })", function () {
      it("should return range", async function () {
        const start = undefined;
        const end = null;
        const options: RangeOptions = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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

    describe("#getRange(9, 0, { reverse })", function () {
      it("should return range", async function () {
        const start = 9;
        const end = 0;
        const options: RangeOptions = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
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
        ]);
      });
    });

    describe("#getRange(7, 3, { reverse })", function () {
      it("should return range", async function () {
        const start = 7;
        const end = 3;
        const options: RangeOptions = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [7, 7],
          [6, 6],
          [5, 5],
          [4, 4],
        ]);
      });
    });

    describe("#getRange(7, null, { reverse })", function () {
      it("should return range", async function () {
        const start = 7;
        const end = null;
        const options: RangeOptions = { reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
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

    describe("#getRange(7, null, { limit: 3, reverse })", function () {
      it("should return range", async function () {
        const start = 7;
        const end = null;
        const options: RangeOptions = { limit: 3, reverse: true };
        const values = await storage
          .bucket("test")
          .getRange(start, end, options);
        expect(values).to.deep.equal([
          [7, 7],
          [6, 6],
          [5, 5],
        ]);
      });
    });
  });
}
