import { expect } from "chai";
import { StorageContract } from "./contracts/storage.contract.js";

export function collationTest(storageFn: () => StorageContract): void {
  describe("Collation", function () {
    let storage: StorageContract;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      await storage.write(["test"], async (transaction) => {
        const { asc, desc } = transaction.order;
        transaction.bucket("test").clearRange(asc(null), desc(null));
      });
    });

    context("when insert in ascending order", function () {
      it("should return in the correct order", async function () {
        await storage.write(["test"], async (transaction) => {
          const { cast, order } = transaction;
          const bucket = transaction.bucket("test");
          bucket.set(order.asc(null), true);
          bucket.set(order.asc(false), true);
          bucket.set(order.asc(true), true);
          bucket.set(order.asc(cast.int8(-128)), true);
          bucket.set(order.asc(cast.int8(0)), true);
          bucket.set(order.asc(cast.int8(127)), true);
          bucket.set(order.asc(cast.uint8(255)), true);
          bucket.set(order.asc(cast.int16(-128)), true);
          bucket.set(order.asc(cast.int16(0)), true);
          bucket.set(order.asc(cast.int16(127)), true);
          bucket.set(order.asc(cast.uint16(255)), true);
          bucket.set(order.asc(cast.int32(-128)), true);
          bucket.set(order.asc(cast.int32(0)), true);
          bucket.set(order.asc(cast.int32(127)), true);
          bucket.set(order.asc(cast.uint32(255)), true);
          bucket.set(order.asc(cast.int64(BigInt(-128))), true);
          bucket.set(order.asc(cast.int64(BigInt(0))), true);
          bucket.set(order.asc(cast.int64(BigInt(127))), true);
          bucket.set(order.asc(cast.uint64(BigInt(255))), true);
          bucket.set(order.asc(cast.float32(-128)), true);
          bucket.set(order.asc(cast.float32(0)), true);
          bucket.set(order.asc(cast.float32(127)), true);
          bucket.set(order.asc(cast.float64(-Infinity)), true);
          bucket.set(order.asc(cast.float64(-Math.PI)), true);
          bucket.set(order.asc(cast.float64(0)), true);
          bucket.set(order.asc(cast.float64(Math.PI)), true);
          bucket.set(order.asc(cast.float64(Infinity)), true);
          bucket.set(order.asc(new Date(-1000)), true);
          bucket.set(order.asc(new Date(1000)), true);
          bucket.set(order.asc(Buffer.from([0])), true);
          bucket.set(order.asc(Buffer.from([255])), true);
          bucket.set(order.asc(""), true);
          bucket.set(order.asc("\xff"), true);
          bucket.set(order.asc([null]), true);
          bucket.set(order.asc([false]), true);
          bucket.set(order.asc([true]), true);
          bucket.set(order.asc([cast.int8(-128)]), true);
          bucket.set(order.asc([cast.int8(0)]), true);
          bucket.set(order.asc([cast.int8(127)]), true);
          bucket.set(order.asc([cast.uint8(255)]), true);
          bucket.set(order.asc([cast.int16(-128)]), true);
          bucket.set(order.asc([cast.int16(0)]), true);
          bucket.set(order.asc([cast.int16(127)]), true);
          bucket.set(order.asc([cast.uint16(255)]), true);
          bucket.set(order.asc([cast.int32(-128)]), true);
          bucket.set(order.asc([cast.int32(0)]), true);
          bucket.set(order.asc([cast.int32(127)]), true);
          bucket.set(order.asc([cast.uint32(255)]), true);
          bucket.set(order.asc([cast.int64(BigInt(-128))]), true);
          bucket.set(order.asc([cast.int64(BigInt(0))]), true);
          bucket.set(order.asc([cast.int64(BigInt(127))]), true);
          bucket.set(order.asc([cast.uint64(BigInt(255))]), true);
          bucket.set(order.asc([cast.float32(-128)]), true);
          bucket.set(order.asc([cast.float32(0)]), true);
          bucket.set(order.asc([cast.float32(127)]), true);
          bucket.set(order.asc([cast.float64(-Infinity)]), true);
          bucket.set(order.asc([cast.float64(-Math.PI)]), true);
          bucket.set(order.asc([cast.float64(0)]), true);
          bucket.set(order.asc([cast.float64(Math.PI)]), true);
          bucket.set(order.asc([cast.float64(Infinity)]), true);
          bucket.set(order.asc([new Date(-1000)]), true);
          bucket.set(order.asc([new Date(1000)]), true);
          bucket.set(order.asc([Buffer.from([0])]), true);
          bucket.set(order.asc([Buffer.from([255])]), true);
          bucket.set(order.asc([""]), true);
          bucket.set(order.asc(["\xff"]), true);
          bucket.set(order.asc({ a: null }), true);
          bucket.set(order.asc({ a: false }), true);
          bucket.set(order.asc({ a: true }), true);
          bucket.set(order.asc({ a: cast.int8(-128) }), true);
          bucket.set(order.asc({ a: cast.int8(0) }), true);
          bucket.set(order.asc({ a: cast.int8(127) }), true);
          bucket.set(order.asc({ a: cast.uint8(255) }), true);
          bucket.set(order.asc({ a: cast.int16(-128) }), true);
          bucket.set(order.asc({ a: cast.int16(0) }), true);
          bucket.set(order.asc({ a: cast.int16(127) }), true);
          bucket.set(order.asc({ a: cast.uint16(255) }), true);
          bucket.set(order.asc({ a: cast.int32(-128) }), true);
          bucket.set(order.asc({ a: cast.int32(0) }), true);
          bucket.set(order.asc({ a: cast.int32(127) }), true);
          bucket.set(order.asc({ a: cast.uint32(255) }), true);
          bucket.set(order.asc({ a: cast.int64(BigInt(-128)) }), true);
          bucket.set(order.asc({ a: cast.int64(BigInt(0)) }), true);
          bucket.set(order.asc({ a: cast.int64(BigInt(127)) }), true);
          bucket.set(order.asc({ a: cast.uint64(BigInt(255)) }), true);
          bucket.set(order.asc({ a: cast.float32(-128) }), true);
          bucket.set(order.asc({ a: cast.float32(0) }), true);
          bucket.set(order.asc({ a: cast.float32(127) }), true);
          bucket.set(order.asc({ a: cast.float64(-Infinity) }), true);
          bucket.set(order.asc({ a: cast.float64(-Math.PI) }), true);
          bucket.set(order.asc({ a: cast.float64(0) }), true);
          bucket.set(order.asc({ a: cast.float64(Math.PI) }), true);
          bucket.set(order.asc({ a: cast.float64(Infinity) }), true);
          bucket.set(order.asc({ a: new Date(-1000) }), true);
          bucket.set(order.asc({ a: new Date(1000) }), true);
          bucket.set(order.asc({ a: Buffer.from([0]) }), true);
          bucket.set(order.asc({ a: Buffer.from([255]) }), true);
          bucket.set(order.asc({ a: "" }), true);
          bucket.set(order.asc({ a: "\xff" }), true);
          bucket.set(order.asc(undefined), true);
        });

        const collation = await storage.read(["test"], async (transaction) => {
          const { order } = transaction;
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(order.asc(null), order.desc(null)))
            collection.push(entry);
          return collection;
        });
        expect(collation).to.deep.equal([
          [null, true],
          [false, true],
          [true, true],
          [-128, true],
          [0, true],
          [127, true],
          [255, true],
          [-128, true],
          [0, true],
          [127, true],
          [255, true],
          [-128, true],
          [0, true],
          [127, true],
          [255, true],
          [BigInt(-128), true],
          [BigInt(0), true],
          [BigInt(127), true],
          [BigInt(255), true],
          [-128, true],
          [0, true],
          [127, true],
          [-Infinity, true],
          [-Math.PI, true],
          [0, true],
          [Math.PI, true],
          [Infinity, true],
          [new Date(-1000), true],
          [new Date(1000), true],
          [Buffer.from([0]), true],
          [Buffer.from([255]), true],
          ["", true],
          ["\xff", true],
          [[null], true],
          [[false], true],
          [[true], true],
          [[-128], true],
          [[0], true],
          [[127], true],
          [[255], true],
          [[-128], true],
          [[0], true],
          [[127], true],
          [[255], true],
          [[-128], true],
          [[0], true],
          [[127], true],
          [[255], true],
          [[BigInt(-128)], true],
          [[BigInt(0)], true],
          [[BigInt(127)], true],
          [[BigInt(255)], true],
          [[-128], true],
          [[0], true],
          [[127], true],
          [[-Infinity], true],
          [[-Math.PI], true],
          [[0], true],
          [[Math.PI], true],
          [[Infinity], true],
          [[new Date(-1000)], true],
          [[new Date(1000)], true],
          [[Buffer.from([0])], true],
          [[Buffer.from([255])], true],
          [[""], true],
          [["\xff"], true],
          [{ a: null }, true],
          [{ a: false }, true],
          [{ a: true }, true],
          [{ a: -128 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: 255 }, true],
          [{ a: -128 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: 255 }, true],
          [{ a: -128 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: 255 }, true],
          [{ a: BigInt(-128) }, true],
          [{ a: BigInt(0) }, true],
          [{ a: BigInt(127) }, true],
          [{ a: BigInt(255) }, true],
          [{ a: -128 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: -Infinity }, true],
          [{ a: -Math.PI }, true],
          [{ a: 0 }, true],
          [{ a: Math.PI }, true],
          [{ a: Infinity }, true],
          [{ a: new Date(-1000) }, true],
          [{ a: new Date(1000) }, true],
          [{ a: Buffer.from([0]) }, true],
          [{ a: Buffer.from([255]) }, true],
          [{ a: "" }, true],
          [{ a: "\xff" }, true],
          [undefined, true],
        ]);
      });
    });

    context("when insert in descending order", function () {
      it("should return in the correct order", async function () {
        await storage.write(["test"], async (transaction) => {
          const { cast, order } = transaction;
          const bucket = transaction.bucket("test");
          bucket.set(order.desc(null), true);
          bucket.set(order.desc(false), true);
          bucket.set(order.desc(true), true);
          bucket.set(order.desc(cast.int8(-128)), true);
          bucket.set(order.desc(cast.int8(0)), true);
          bucket.set(order.desc(cast.int8(127)), true);
          bucket.set(order.desc(cast.uint8(255)), true);
          bucket.set(order.desc(cast.int16(-128)), true);
          bucket.set(order.desc(cast.int16(0)), true);
          bucket.set(order.desc(cast.int16(127)), true);
          bucket.set(order.desc(cast.uint16(255)), true);
          bucket.set(order.desc(cast.int32(-128)), true);
          bucket.set(order.desc(cast.int32(0)), true);
          bucket.set(order.desc(cast.int32(127)), true);
          bucket.set(order.desc(cast.uint32(255)), true);
          bucket.set(order.desc(cast.int64(BigInt(-128))), true);
          bucket.set(order.desc(cast.int64(BigInt(0))), true);
          bucket.set(order.desc(cast.int64(BigInt(127))), true);
          bucket.set(order.desc(cast.uint64(BigInt(255))), true);
          bucket.set(order.desc(cast.float32(-128)), true);
          bucket.set(order.desc(cast.float32(0)), true);
          bucket.set(order.desc(cast.float32(127)), true);
          bucket.set(order.desc(cast.float64(-Infinity)), true);
          bucket.set(order.desc(cast.float64(-Math.PI)), true);
          bucket.set(order.desc(cast.float64(0)), true);
          bucket.set(order.desc(cast.float64(Math.PI)), true);
          bucket.set(order.desc(cast.float64(Infinity)), true);
          bucket.set(order.desc(new Date(-1000)), true);
          bucket.set(order.desc(new Date(1000)), true);
          bucket.set(order.desc(Buffer.from([0])), true);
          bucket.set(order.desc(Buffer.from([255])), true);
          bucket.set(order.desc(""), true);
          bucket.set(order.desc("\xff"), true);
          bucket.set(order.desc([null]), true);
          bucket.set(order.desc([false]), true);
          bucket.set(order.desc([true]), true);
          bucket.set(order.desc([cast.int8(-128)]), true);
          bucket.set(order.desc([cast.int8(0)]), true);
          bucket.set(order.desc([cast.int8(127)]), true);
          bucket.set(order.desc([cast.uint8(255)]), true);
          bucket.set(order.desc([cast.int16(-128)]), true);
          bucket.set(order.desc([cast.int16(0)]), true);
          bucket.set(order.desc([cast.int16(127)]), true);
          bucket.set(order.desc([cast.uint16(255)]), true);
          bucket.set(order.desc([cast.int32(-128)]), true);
          bucket.set(order.desc([cast.int32(0)]), true);
          bucket.set(order.desc([cast.int32(127)]), true);
          bucket.set(order.desc([cast.uint32(255)]), true);
          bucket.set(order.desc([cast.int64(BigInt(-128))]), true);
          bucket.set(order.desc([cast.int64(BigInt(0))]), true);
          bucket.set(order.desc([cast.int64(BigInt(127))]), true);
          bucket.set(order.desc([cast.uint64(BigInt(255))]), true);
          bucket.set(order.desc([cast.float32(-128)]), true);
          bucket.set(order.desc([cast.float32(0)]), true);
          bucket.set(order.desc([cast.float32(127)]), true);
          bucket.set(order.desc([cast.float64(-Infinity)]), true);
          bucket.set(order.desc([cast.float64(-Math.PI)]), true);
          bucket.set(order.desc([cast.float64(0)]), true);
          bucket.set(order.desc([cast.float64(Math.PI)]), true);
          bucket.set(order.desc([cast.float64(Infinity)]), true);
          bucket.set(order.desc([new Date(-1000)]), true);
          bucket.set(order.desc([new Date(1000)]), true);
          bucket.set(order.desc([Buffer.from([0])]), true);
          bucket.set(order.desc([Buffer.from([255])]), true);
          bucket.set(order.desc([""]), true);
          bucket.set(order.desc(["\xff"]), true);
          bucket.set(order.desc({ a: null }), true);
          bucket.set(order.desc({ a: false }), true);
          bucket.set(order.desc({ a: true }), true);
          bucket.set(order.desc({ a: cast.int8(-128) }), true);
          bucket.set(order.desc({ a: cast.int8(0) }), true);
          bucket.set(order.desc({ a: cast.int8(127) }), true);
          bucket.set(order.desc({ a: cast.uint8(255) }), true);
          bucket.set(order.desc({ a: cast.int16(-128) }), true);
          bucket.set(order.desc({ a: cast.int16(0) }), true);
          bucket.set(order.desc({ a: cast.int16(127) }), true);
          bucket.set(order.desc({ a: cast.uint16(255) }), true);
          bucket.set(order.desc({ a: cast.int32(-128) }), true);
          bucket.set(order.desc({ a: cast.int32(0) }), true);
          bucket.set(order.desc({ a: cast.int32(127) }), true);
          bucket.set(order.desc({ a: cast.uint32(255) }), true);
          bucket.set(order.desc({ a: cast.int64(BigInt(-128)) }), true);
          bucket.set(order.desc({ a: cast.int64(BigInt(0)) }), true);
          bucket.set(order.desc({ a: cast.int64(BigInt(127)) }), true);
          bucket.set(order.desc({ a: cast.uint64(BigInt(255)) }), true);
          bucket.set(order.desc({ a: cast.float32(-128) }), true);
          bucket.set(order.desc({ a: cast.float32(0) }), true);
          bucket.set(order.desc({ a: cast.float32(127) }), true);
          bucket.set(order.desc({ a: cast.float64(-Infinity) }), true);
          bucket.set(order.desc({ a: cast.float64(-Math.PI) }), true);
          bucket.set(order.desc({ a: cast.float64(0) }), true);
          bucket.set(order.desc({ a: cast.float64(Math.PI) }), true);
          bucket.set(order.desc({ a: cast.float64(Infinity) }), true);
          bucket.set(order.desc({ a: new Date(-1000) }), true);
          bucket.set(order.desc({ a: new Date(1000) }), true);
          bucket.set(order.desc({ a: Buffer.from([0]) }), true);
          bucket.set(order.desc({ a: Buffer.from([255]) }), true);
          bucket.set(order.desc({ a: "" }), true);
          bucket.set(order.desc({ a: "\xff" }), true);
          bucket.set(order.desc(undefined), true);
        });

        const collation = await storage.read(["test"], async (transaction) => {
          const { order } = transaction;
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket("test")
            .getRange(order.asc(null), order.desc(null)))
            collection.push(entry);
          return collection;
        });
        expect(collation).to.deep.equal([
          [undefined, true],
          [{ a: "\xff" }, true],
          [{ a: "" }, true],
          [{ a: Buffer.from([255]) }, true],
          [{ a: Buffer.from([0]) }, true],
          [{ a: new Date(1000) }, true],
          [{ a: new Date(-1000) }, true],
          [{ a: Infinity }, true],
          [{ a: Math.PI }, true],
          [{ a: 0 }, true],
          [{ a: -Math.PI }, true],
          [{ a: -Infinity }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: -128 }, true],
          [{ a: BigInt(255) }, true],
          [{ a: BigInt(127) }, true],
          [{ a: BigInt(0) }, true],
          [{ a: BigInt(-128) }, true],
          [{ a: 255 }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: -128 }, true],
          [{ a: 255 }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: -128 }, true],
          [{ a: 255 }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: -128 }, true],
          [{ a: true }, true],
          [{ a: false }, true],
          [{ a: null }, true],
          [["\xff"], true],
          [[""], true],
          [[Buffer.from([255])], true],
          [[Buffer.from([0])], true],
          [[new Date(1000)], true],
          [[new Date(-1000)], true],
          [[Infinity], true],
          [[Math.PI], true],
          [[0], true],
          [[-Math.PI], true],
          [[-Infinity], true],
          [[127], true],
          [[0], true],
          [[-128], true],
          [[BigInt(255)], true],
          [[BigInt(127)], true],
          [[BigInt(0)], true],
          [[BigInt(-128)], true],
          [[255], true],
          [[127], true],
          [[0], true],
          [[-128], true],
          [[255], true],
          [[127], true],
          [[0], true],
          [[-128], true],
          [[255], true],
          [[127], true],
          [[0], true],
          [[-128], true],
          [[true], true],
          [[false], true],
          [[null], true],
          ["\xff", true],
          ["", true],
          [Buffer.from([255]), true],
          [Buffer.from([0]), true],
          [new Date(1000), true],
          [new Date(-1000), true],
          [Infinity, true],
          [Math.PI, true],
          [0, true],
          [-Math.PI, true],
          [-Infinity, true],
          [127, true],
          [0, true],
          [-128, true],
          [BigInt(255), true],
          [BigInt(127), true],
          [BigInt(0), true],
          [BigInt(-128), true],
          [255, true],
          [127, true],
          [0, true],
          [-128, true],
          [255, true],
          [127, true],
          [0, true],
          [-128, true],
          [255, true],
          [127, true],
          [0, true],
          [-128, true],
          [true, true],
          [false, true],
        ]);
      });
    });
  });
}
