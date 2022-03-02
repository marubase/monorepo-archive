import { expect } from "chai";
import { IteratorReadable } from "./iterator-readable.js";

describe("IteratorReadable", function () {
  describe("static accept(input)", function () {
    context("when input is Array", function () {
      it("should return true", async function () {
        const input = [0, 1, 2, 3];
        const accept = IteratorReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is AsyncIterable", function () {
      it("should return true", async function () {
        const input = {
          index: 0,
          items: [0, 1, 2, 3],
          [Symbol.asyncIterator](): AsyncIterator<number> {
            return this;
          },
          async next(): Promise<IteratorResult<number>> {
            return this.index < this.items.length
              ? { done: false, value: this.items[this.index++] }
              : { done: true, value: undefined };
          },
        };
        const accept = IteratorReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is Iterable", function () {
      it("should return true", async function () {
        const input = {
          index: 0,
          items: [0, 1, 2, 3],
          [Symbol.iterator](): Iterator<number> {
            return this;
          },
          next(): IteratorResult<number> {
            return this.index < this.items.length
              ? { done: false, value: this.items[this.index++] }
              : { done: true, value: undefined };
          },
        };
        const accept = IteratorReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is AsyncIterator", function () {
      it("should return true", async function () {
        const input = {
          index: 0,
          items: [0, 1, 2, 3],
          async next(): Promise<IteratorResult<number>> {
            return this.index < this.items.length
              ? { done: false, value: this.items[this.index++] }
              : { done: true, value: undefined };
          },
        };
        const accept = IteratorReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is Iterator", function () {
      it("should return true", async function () {
        const input = {
          index: 0,
          items: [0, 1, 2, 3],
          next(): IteratorResult<number> {
            return this.index < this.items.length
              ? { done: false, value: this.items[this.index++] }
              : { done: true, value: undefined };
          },
        };
        const accept = IteratorReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
  });

  context("when input is Array", function () {
    it("should stream", async function () {
      const input = [0, 1, 2, 3];
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items.length).to.equal(4);
    });
  });

  context("when input is AsyncIterable", function () {
    it("should stream", async function () {
      const input = {
        index: 0,
        items: [0, 1, 2, 3],
        [Symbol.asyncIterator](): AsyncIterator<number> {
          return this;
        },
        async next(): Promise<IteratorResult<number>> {
          return this.index < this.items.length
            ? { done: false, value: this.items[this.index++] }
            : { done: true, value: undefined };
        },
      };
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items.length).to.equal(4);
    });
  });

  context("when input is Iterable", function () {
    it("should stream", async function () {
      const input = {
        index: 0,
        items: [0, 1, 2, 3],
        [Symbol.iterator](): Iterator<number> {
          return this;
        },
        next(): IteratorResult<number> {
          return this.index < this.items.length
            ? { done: false, value: this.items[this.index++] }
            : { done: true, value: undefined };
        },
      };
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items.length).to.equal(4);
    });
  });

  context("when input is AsyncIterator", function () {
    it("should stream", async function () {
      const input = {
        index: 0,
        items: [0, 1, 2, 3],
        async next(): Promise<IteratorResult<number>> {
          return this.index < this.items.length
            ? { done: false, value: this.items[this.index++] }
            : { done: true, value: undefined };
        },
      };
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items.length).to.equal(4);
    });
  });

  context("when input is Iterator", function () {
    it("should stream", async function () {
      const input = {
        index: 0,
        items: [0, 1, 2, 3],
        next(): IteratorResult<number> {
          return this.index < this.items.length
            ? { done: false, value: this.items[this.index++] }
            : { done: true, value: undefined };
        },
      };
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      for await (const item of readable) items.push(item);
      expect(items.length).to.equal(4);
    });
  });

  context("when input throw error", function () {
    it("should stream", async function () {
      const input = {
        index: 0,
        items: [0, 1, 2, 3],
        async next(): Promise<IteratorResult<number>> {
          if (this.index < this.items.length)
            return { done: false, value: this.items[this.index++] };
          throw new Error("test error");
        },
      };
      const readable = new IteratorReadable(input, {});

      const items: number[] = [];
      try {
        for await (const item of readable) items.push(item);
      } catch (error) {} // eslint-disable-line no-empty
    });
  });
});
