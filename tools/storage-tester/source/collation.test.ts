import { StorageInterface } from "@marubase/storage";
import { expect } from "chai";

export function collationTest(storageFn: () => StorageInterface): void {
  describe("Collation", function () {
    let storage: StorageInterface;
    beforeEach(async function () {
      storage = storageFn();
    });
    afterEach(async function () {
      const { asc, desc } = storage.order;
      await storage.bucket("test").clearRange(asc(null), desc(null));
    });

    context("insert different key type in ascending order", function () {
      it("should return ordered entry", async function () {
        const { asc, desc } = storage.order;
        await storage.write("test", async (transaction) => {
          transaction.bucket("test").set(asc(false), true);
          transaction.bucket("test").set(asc(true), true);

          const { int8, uint8 } = transaction.cast;
          transaction.bucket("test").set(asc(int8(-128)), true);
          transaction.bucket("test").set(asc(int8(0)), true);
          transaction.bucket("test").set(asc(int8(127)), true);
          transaction.bucket("test").set(asc(uint8(0)), true);
          transaction.bucket("test").set(asc(uint8(255)), true);

          const { int16, uint16 } = transaction.cast;
          transaction.bucket("test").set(asc(int16(-32768)), true);
          transaction.bucket("test").set(asc(int16(0)), true);
          transaction.bucket("test").set(asc(int16(32767)), true);
          transaction.bucket("test").set(asc(uint16(0)), true);
          transaction.bucket("test").set(asc(uint16(65535)), true);

          const { int32, uint32 } = transaction.cast;
          transaction.bucket("test").set(asc(int32(-2147483648)), true);
          transaction.bucket("test").set(asc(int32(0)), true);
          transaction.bucket("test").set(asc(int32(2147483647)), true);
          transaction.bucket("test").set(asc(uint32(0)), true);
          transaction.bucket("test").set(asc(uint32(4294967295)), true);

          const { int64, uint64 } = transaction.cast;
          transaction
            .bucket("test")
            .set(asc(int64(-9223372036854775808n)), true);
          transaction.bucket("test").set(asc(int64(0n)), true);
          transaction
            .bucket("test")
            .set(asc(int64(9223372036854775807n)), true);
          transaction.bucket("test").set(asc(uint64(0n)), true);
          transaction
            .bucket("test")
            .set(asc(uint64(18446744073709551615n)), true);

          const { float32 } = transaction.cast;
          transaction.bucket("test").set(asc(float32(-Infinity)), true);
          transaction.bucket("test").set(asc(float32(0)), true);
          transaction.bucket("test").set(asc(float32(Infinity)), true);

          const { float64 } = transaction.cast;
          transaction.bucket("test").set(asc(float64(-Infinity)), true);
          transaction.bucket("test").set(asc(float64(-Math.PI)), true);
          transaction.bucket("test").set(asc(float64(-Math.E)), true);
          transaction.bucket("test").set(asc(float64(0)), true);
          transaction.bucket("test").set(asc(float64(Math.E)), true);
          transaction.bucket("test").set(asc(float64(Math.PI)), true);
          transaction.bucket("test").set(asc(float64(Infinity)), true);
          transaction.bucket("test").set(asc(new Date(-1000)), true);
          transaction.bucket("test").set(asc(new Date(1000)), true);
          transaction.bucket("test").set(asc(Buffer.from([0])), true);
          transaction.bucket("test").set(asc(Buffer.from([255])), true);
          transaction.bucket("test").set(asc("a"), true);
          transaction.bucket("test").set(asc("z"), true);

          transaction.bucket("test").set(asc([false, true]), true);
          transaction.bucket("test").set(asc([true, true]), true);
          transaction.bucket("test").set(asc([int8(-128), true]), true);
          transaction.bucket("test").set(asc([int8(0), true]), true);
          transaction.bucket("test").set(asc([int8(127), true]), true);
          transaction.bucket("test").set(asc([uint8(0), true]), true);
          transaction.bucket("test").set(asc([uint8(255), true]), true);
          transaction.bucket("test").set(asc([int16(-32768), true]), true);
          transaction.bucket("test").set(asc([int16(0), true]), true);
          transaction.bucket("test").set(asc([int16(32767), true]), true);
          transaction.bucket("test").set(asc([uint16(0), true]), true);
          transaction.bucket("test").set(asc([uint16(65535), true]), true);
          transaction.bucket("test").set(asc([int32(-2147483648), true]), true);
          transaction.bucket("test").set(asc([int32(0), true]), true);
          transaction.bucket("test").set(asc([int32(2147483647), true]), true);
          transaction.bucket("test").set(asc([uint32(0), true]), true);
          transaction.bucket("test").set(asc([uint32(4294967295), true]), true);
          transaction
            .bucket("test")
            .set(asc([int64(-9223372036854775808n), true]), true);
          transaction.bucket("test").set(asc([int64(0n), true]), true);
          transaction
            .bucket("test")
            .set(asc([int64(9223372036854775807n), true]), true);
          transaction.bucket("test").set(asc([uint64(0n), true]), true);
          transaction
            .bucket("test")
            .set(asc([uint64(18446744073709551615n), true]), true);
          transaction.bucket("test").set(asc([float32(-Infinity), true]), true);
          transaction.bucket("test").set(asc([float32(0), true]), true);
          transaction.bucket("test").set(asc([float32(Infinity), true]), true);
          transaction.bucket("test").set(asc([float64(-Infinity), true]), true);
          transaction.bucket("test").set(asc([float64(-Math.PI), true]), true);
          transaction.bucket("test").set(asc([float64(-Math.E), true]), true);
          transaction.bucket("test").set(asc([float64(0), true]), true);
          transaction.bucket("test").set(asc([float64(Math.E), true]), true);
          transaction.bucket("test").set(asc([float64(Math.PI), true]), true);
          transaction.bucket("test").set(asc([float64(Infinity), true]), true);
          transaction.bucket("test").set(asc([new Date(-1000), true]), true);
          transaction.bucket("test").set(asc([new Date(1000), true]), true);
          transaction.bucket("test").set(asc([Buffer.from([0]), true]), true);
          transaction.bucket("test").set(asc([Buffer.from([255]), true]), true);
          transaction.bucket("test").set(asc(["a", true]), true);
          transaction.bucket("test").set(asc(["z", true]), true);

          transaction.bucket("test").set(asc({ a: false }), true);
          transaction.bucket("test").set(asc({ a: true }), true);
          transaction.bucket("test").set(asc({ a: int8(-128) }), true);
          transaction.bucket("test").set(asc({ a: int8(0) }), true);
          transaction.bucket("test").set(asc({ a: int8(127) }), true);
          transaction.bucket("test").set(asc({ a: uint8(0) }), true);
          transaction.bucket("test").set(asc({ a: uint8(255) }), true);
          transaction.bucket("test").set(asc({ a: int16(-32768) }), true);
          transaction.bucket("test").set(asc({ a: int16(0) }), true);
          transaction.bucket("test").set(asc({ a: int16(32767) }), true);
          transaction.bucket("test").set(asc({ a: uint16(0) }), true);
          transaction.bucket("test").set(asc({ a: uint16(65535) }), true);
          transaction.bucket("test").set(asc({ a: int32(-2147483648) }), true);
          transaction.bucket("test").set(asc({ a: int32(0) }), true);
          transaction.bucket("test").set(asc({ a: int32(2147483647) }), true);
          transaction.bucket("test").set(asc({ a: uint32(0) }), true);
          transaction.bucket("test").set(asc({ a: uint32(4294967295) }), true);
          transaction
            .bucket("test")
            .set(asc({ a: int64(-9223372036854775808n) }), true);
          transaction.bucket("test").set(asc({ a: int64(0n) }), true);
          transaction
            .bucket("test")
            .set(asc({ a: int64(9223372036854775807n) }), true);
          transaction.bucket("test").set(asc({ a: uint64(0n) }), true);
          transaction
            .bucket("test")
            .set(asc({ a: uint64(18446744073709551615n) }), true);
          transaction.bucket("test").set(asc({ a: float32(-Infinity) }), true);
          transaction.bucket("test").set(asc({ a: float32(0) }), true);
          transaction.bucket("test").set(asc({ a: float32(Infinity) }), true);
          transaction.bucket("test").set(asc({ a: float64(-Infinity) }), true);
          transaction.bucket("test").set(asc({ a: float64(-Math.PI) }), true);
          transaction.bucket("test").set(asc({ a: float64(-Math.E) }), true);
          transaction.bucket("test").set(asc({ a: float64(0) }), true);
          transaction.bucket("test").set(asc({ a: float64(Math.E) }), true);
          transaction.bucket("test").set(asc({ a: float64(Math.PI) }), true);
          transaction.bucket("test").set(asc({ a: float64(Infinity) }), true);
          transaction.bucket("test").set(asc({ a: new Date(-1000) }), true);
          transaction.bucket("test").set(asc({ a: new Date(1000) }), true);
          transaction.bucket("test").set(asc({ a: Buffer.from([0]) }), true);
          transaction.bucket("test").set(asc({ a: Buffer.from([255]) }), true);
          transaction.bucket("test").set(asc({ a: "a" }), true);
          transaction.bucket("test").set(asc({ a: "z" }), true);
        });

        const collection = await storage
          .bucket("test")
          .getRange(asc(null), desc(null));
        expect(collection).to.deep.equal([
          [false, true],
          [true, true],
          [-128, true],
          [0, true],
          [127, true],
          [0, true],
          [255, true],
          [-32768, true],
          [0, true],
          [32767, true],
          [0, true],
          [65535, true],
          [-2147483648, true],
          [0, true],
          [2147483647, true],
          [0, true],
          [4294967295, true],
          [-9223372036854775808n, true],
          [0n, true],
          [9223372036854775807n, true],
          [0n, true],
          [18446744073709551615n, true],
          [-Infinity, true],
          [0, true],
          [Infinity, true],
          [-Infinity, true],
          [-Math.PI, true],
          [-Math.E, true],
          [0, true],
          [Math.E, true],
          [Math.PI, true],
          [Infinity, true],
          [new Date(-1000), true],
          [new Date(1000), true],
          [Buffer.from([0]), true],
          [Buffer.from([255]), true],
          ["a", true],
          ["z", true],

          [[false, true], true],
          [[true, true], true],
          [[-128, true], true],
          [[0, true], true],
          [[127, true], true],
          [[0, true], true],
          [[255, true], true],
          [[-32768, true], true],
          [[0, true], true],
          [[32767, true], true],
          [[0, true], true],
          [[65535, true], true],
          [[-2147483648, true], true],
          [[0, true], true],
          [[2147483647, true], true],
          [[0, true], true],
          [[4294967295, true], true],
          [[-9223372036854775808n, true], true],
          [[0n, true], true],
          [[9223372036854775807n, true], true],
          [[0n, true], true],
          [[18446744073709551615n, true], true],
          [[-Infinity, true], true],
          [[0, true], true],
          [[Infinity, true], true],
          [[-Infinity, true], true],
          [[-Math.PI, true], true],
          [[-Math.E, true], true],
          [[0, true], true],
          [[Math.E, true], true],
          [[Math.PI, true], true],
          [[Infinity, true], true],
          [[new Date(-1000), true], true],
          [[new Date(1000), true], true],
          [[Buffer.from([0]), true], true],
          [[Buffer.from([255]), true], true],
          [["a", true], true],
          [["z", true], true],

          [{ a: false }, true],
          [{ a: true }, true],
          [{ a: -128 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: 255 }, true],
          [{ a: -32768 }, true],
          [{ a: 0 }, true],
          [{ a: 32767 }, true],
          [{ a: 0 }, true],
          [{ a: 65535 }, true],
          [{ a: -2147483648 }, true],
          [{ a: 0 }, true],
          [{ a: 2147483647 }, true],
          [{ a: 0 }, true],
          [{ a: 4294967295 }, true],
          [{ a: -9223372036854775808n }, true],
          [{ a: 0n }, true],
          [{ a: 9223372036854775807n }, true],
          [{ a: 0n }, true],
          [{ a: 18446744073709551615n }, true],
          [{ a: -Infinity }, true],
          [{ a: 0 }, true],
          [{ a: Infinity }, true],
          [{ a: -Infinity }, true],
          [{ a: -Math.PI }, true],
          [{ a: -Math.E }, true],
          [{ a: 0 }, true],
          [{ a: Math.E }, true],
          [{ a: Math.PI }, true],
          [{ a: Infinity }, true],
          [{ a: new Date(-1000) }, true],
          [{ a: new Date(1000) }, true],
          [{ a: Buffer.from([0]) }, true],
          [{ a: Buffer.from([255]) }, true],
          [{ a: "a" }, true],
          [{ a: "z" }, true],
        ]);
      });
    });

    context("insert different key type in descending order", function () {
      it("should return ordered entry", async function () {
        const { asc, desc } = storage.order;
        await storage.write("test", async (transaction) => {
          transaction.bucket("test").set(desc(false), true);
          transaction.bucket("test").set(desc(true), true);

          const { int8, uint8 } = transaction.cast;
          transaction.bucket("test").set(desc(int8(-128)), true);
          transaction.bucket("test").set(desc(int8(0)), true);
          transaction.bucket("test").set(desc(int8(127)), true);
          transaction.bucket("test").set(desc(uint8(0)), true);
          transaction.bucket("test").set(desc(uint8(255)), true);

          const { int16, uint16 } = transaction.cast;
          transaction.bucket("test").set(desc(int16(-32768)), true);
          transaction.bucket("test").set(desc(int16(0)), true);
          transaction.bucket("test").set(desc(int16(32767)), true);
          transaction.bucket("test").set(desc(uint16(0)), true);
          transaction.bucket("test").set(desc(uint16(65535)), true);

          const { int32, uint32 } = transaction.cast;
          transaction.bucket("test").set(desc(int32(-2147483648)), true);
          transaction.bucket("test").set(desc(int32(0)), true);
          transaction.bucket("test").set(desc(int32(2147483647)), true);
          transaction.bucket("test").set(desc(uint32(0)), true);
          transaction.bucket("test").set(desc(uint32(4294967295)), true);

          const { int64, uint64 } = transaction.cast;
          transaction
            .bucket("test")
            .set(desc(int64(-9223372036854775808n)), true);
          transaction.bucket("test").set(desc(int64(0n)), true);
          transaction
            .bucket("test")
            .set(desc(int64(9223372036854775807n)), true);
          transaction.bucket("test").set(desc(uint64(0n)), true);
          transaction
            .bucket("test")
            .set(desc(uint64(18446744073709551615n)), true);

          const { float32 } = transaction.cast;
          transaction.bucket("test").set(desc(float32(-Infinity)), true);
          transaction.bucket("test").set(desc(float32(0)), true);
          transaction.bucket("test").set(desc(float32(Infinity)), true);

          const { float64 } = transaction.cast;
          transaction.bucket("test").set(desc(float64(-Infinity)), true);
          transaction.bucket("test").set(desc(float64(-Math.PI)), true);
          transaction.bucket("test").set(desc(float64(-Math.E)), true);
          transaction.bucket("test").set(desc(float64(0)), true);
          transaction.bucket("test").set(desc(float64(Math.E)), true);
          transaction.bucket("test").set(desc(float64(Math.PI)), true);
          transaction.bucket("test").set(desc(float64(Infinity)), true);
          transaction.bucket("test").set(desc(new Date(-1000)), true);
          transaction.bucket("test").set(desc(new Date(1000)), true);
          transaction.bucket("test").set(desc(Buffer.from([0])), true);
          transaction.bucket("test").set(desc(Buffer.from([255])), true);
          transaction.bucket("test").set(desc("a"), true);
          transaction.bucket("test").set(desc("z"), true);

          transaction.bucket("test").set(desc([false, true]), true);
          transaction.bucket("test").set(desc([true, true]), true);
          transaction.bucket("test").set(desc([int8(-128), true]), true);
          transaction.bucket("test").set(desc([int8(0), true]), true);
          transaction.bucket("test").set(desc([int8(127), true]), true);
          transaction.bucket("test").set(desc([uint8(0), true]), true);
          transaction.bucket("test").set(desc([uint8(255), true]), true);
          transaction.bucket("test").set(desc([int16(-32768), true]), true);
          transaction.bucket("test").set(desc([int16(0), true]), true);
          transaction.bucket("test").set(desc([int16(32767), true]), true);
          transaction.bucket("test").set(desc([uint16(0), true]), true);
          transaction.bucket("test").set(desc([uint16(65535), true]), true);
          transaction
            .bucket("test")
            .set(desc([int32(-2147483648), true]), true);
          transaction.bucket("test").set(desc([int32(0), true]), true);
          transaction.bucket("test").set(desc([int32(2147483647), true]), true);
          transaction.bucket("test").set(desc([uint32(0), true]), true);
          transaction
            .bucket("test")
            .set(desc([uint32(4294967295), true]), true);
          transaction
            .bucket("test")
            .set(desc([int64(-9223372036854775808n), true]), true);
          transaction.bucket("test").set(desc([int64(0n), true]), true);
          transaction
            .bucket("test")
            .set(desc([int64(9223372036854775807n), true]), true);
          transaction.bucket("test").set(desc([uint64(0n), true]), true);
          transaction
            .bucket("test")
            .set(desc([uint64(18446744073709551615n), true]), true);
          transaction
            .bucket("test")
            .set(desc([float32(-Infinity), true]), true);
          transaction.bucket("test").set(desc([float32(0), true]), true);
          transaction.bucket("test").set(desc([float32(Infinity), true]), true);
          transaction
            .bucket("test")
            .set(desc([float64(-Infinity), true]), true);
          transaction.bucket("test").set(desc([float64(-Math.PI), true]), true);
          transaction.bucket("test").set(desc([float64(-Math.E), true]), true);
          transaction.bucket("test").set(desc([float64(0), true]), true);
          transaction.bucket("test").set(desc([float64(Math.E), true]), true);
          transaction.bucket("test").set(desc([float64(Math.PI), true]), true);
          transaction.bucket("test").set(desc([float64(Infinity), true]), true);
          transaction.bucket("test").set(desc([new Date(-1000), true]), true);
          transaction.bucket("test").set(desc([new Date(1000), true]), true);
          transaction.bucket("test").set(desc([Buffer.from([0]), true]), true);
          transaction
            .bucket("test")
            .set(desc([Buffer.from([255]), true]), true);
          transaction.bucket("test").set(desc(["a", true]), true);
          transaction.bucket("test").set(desc(["z", true]), true);

          transaction.bucket("test").set(desc({ a: false }), true);
          transaction.bucket("test").set(desc({ a: true }), true);
          transaction.bucket("test").set(desc({ a: int8(-128) }), true);
          transaction.bucket("test").set(desc({ a: int8(0) }), true);
          transaction.bucket("test").set(desc({ a: int8(127) }), true);
          transaction.bucket("test").set(desc({ a: uint8(0) }), true);
          transaction.bucket("test").set(desc({ a: uint8(255) }), true);
          transaction.bucket("test").set(desc({ a: int16(-32768) }), true);
          transaction.bucket("test").set(desc({ a: int16(0) }), true);
          transaction.bucket("test").set(desc({ a: int16(32767) }), true);
          transaction.bucket("test").set(desc({ a: uint16(0) }), true);
          transaction.bucket("test").set(desc({ a: uint16(65535) }), true);
          transaction.bucket("test").set(desc({ a: int32(-2147483648) }), true);
          transaction.bucket("test").set(desc({ a: int32(0) }), true);
          transaction.bucket("test").set(desc({ a: int32(2147483647) }), true);
          transaction.bucket("test").set(desc({ a: uint32(0) }), true);
          transaction.bucket("test").set(desc({ a: uint32(4294967295) }), true);
          transaction
            .bucket("test")
            .set(desc({ a: int64(-9223372036854775808n) }), true);
          transaction.bucket("test").set(desc({ a: int64(0n) }), true);
          transaction
            .bucket("test")
            .set(desc({ a: int64(9223372036854775807n) }), true);
          transaction.bucket("test").set(desc({ a: uint64(0n) }), true);
          transaction
            .bucket("test")
            .set(desc({ a: uint64(18446744073709551615n) }), true);
          transaction.bucket("test").set(desc({ a: float32(-Infinity) }), true);
          transaction.bucket("test").set(desc({ a: float32(0) }), true);
          transaction.bucket("test").set(desc({ a: float32(Infinity) }), true);
          transaction.bucket("test").set(desc({ a: float64(-Infinity) }), true);
          transaction.bucket("test").set(desc({ a: float64(-Math.PI) }), true);
          transaction.bucket("test").set(desc({ a: float64(-Math.E) }), true);
          transaction.bucket("test").set(desc({ a: float64(0) }), true);
          transaction.bucket("test").set(desc({ a: float64(Math.E) }), true);
          transaction.bucket("test").set(desc({ a: float64(Math.PI) }), true);
          transaction.bucket("test").set(desc({ a: float64(Infinity) }), true);
          transaction.bucket("test").set(desc({ a: new Date(-1000) }), true);
          transaction.bucket("test").set(desc({ a: new Date(1000) }), true);
          transaction.bucket("test").set(desc({ a: Buffer.from([0]) }), true);
          transaction.bucket("test").set(desc({ a: Buffer.from([255]) }), true);
          transaction.bucket("test").set(desc({ a: "a" }), true);
          transaction.bucket("test").set(desc({ a: "z" }), true);
        });

        const collection = await storage
          .bucket("test")
          .getRange(asc(null), desc(null));
        expect(collection).to.deep.equal([
          [{ a: "z" }, true],
          [{ a: "a" }, true],
          [{ a: Buffer.from([255]) }, true],
          [{ a: Buffer.from([0]) }, true],
          [{ a: new Date(1000) }, true],
          [{ a: new Date(-1000) }, true],
          [{ a: Infinity }, true],
          [{ a: Math.PI }, true],
          [{ a: Math.E }, true],
          [{ a: 0 }, true],
          [{ a: -Math.E }, true],
          [{ a: -Math.PI }, true],
          [{ a: -Infinity }, true],
          [{ a: Infinity }, true],
          [{ a: 0 }, true],
          [{ a: -Infinity }, true],
          [{ a: 18446744073709551615n }, true],
          [{ a: 0n }, true],
          [{ a: 9223372036854775807n }, true],
          [{ a: 0n }, true],
          [{ a: -9223372036854775808n }, true],
          [{ a: 4294967295 }, true],
          [{ a: 0 }, true],
          [{ a: 2147483647 }, true],
          [{ a: 0 }, true],
          [{ a: -2147483648 }, true],
          [{ a: 65535 }, true],
          [{ a: 0 }, true],
          [{ a: 32767 }, true],
          [{ a: 0 }, true],
          [{ a: -32768 }, true],
          [{ a: 255 }, true],
          [{ a: 0 }, true],
          [{ a: 127 }, true],
          [{ a: 0 }, true],
          [{ a: -128 }, true],
          [{ a: true }, true],
          [{ a: false }, true],

          [["z", true], true],
          [["a", true], true],
          [[Buffer.from([255]), true], true],
          [[Buffer.from([0]), true], true],
          [[new Date(1000), true], true],
          [[new Date(-1000), true], true],
          [[Infinity, true], true],
          [[Math.PI, true], true],
          [[Math.E, true], true],
          [[0, true], true],
          [[-Math.E, true], true],
          [[-Math.PI, true], true],
          [[-Infinity, true], true],
          [[Infinity, true], true],
          [[0, true], true],
          [[-Infinity, true], true],
          [[18446744073709551615n, true], true],
          [[0n, true], true],
          [[9223372036854775807n, true], true],
          [[0n, true], true],
          [[-9223372036854775808n, true], true],
          [[4294967295, true], true],
          [[0, true], true],
          [[2147483647, true], true],
          [[0, true], true],
          [[-2147483648, true], true],
          [[65535, true], true],
          [[0, true], true],
          [[32767, true], true],
          [[0, true], true],
          [[-32768, true], true],
          [[255, true], true],
          [[0, true], true],
          [[127, true], true],
          [[0, true], true],
          [[-128, true], true],
          [[true, true], true],
          [[false, true], true],

          ["z", true],
          ["a", true],
          [Buffer.from([255]), true],
          [Buffer.from([0]), true],
          [new Date(1000), true],
          [new Date(-1000), true],
          [Infinity, true],
          [Math.PI, true],
          [Math.E, true],
          [0, true],
          [-Math.E, true],
          [-Math.PI, true],
          [-Infinity, true],
          [Infinity, true],
          [0, true],
          [-Infinity, true],
          [18446744073709551615n, true],
          [0n, true],
          [9223372036854775807n, true],
          [0n, true],
          [-9223372036854775808n, true],
          [4294967295, true],
          [0, true],
          [2147483647, true],
          [0, true],
          [-2147483648, true],
          [65535, true],
          [0, true],
          [32767, true],
          [0, true],
          [-32768, true],
          [255, true],
          [0, true],
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
