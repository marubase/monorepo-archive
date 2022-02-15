import Stream from "readable-stream";

export class Readable extends Stream.Readable {
  public static from(
    iterable: IterableInput,
    options?: Stream.ReadableOptions,
  ): Readable {
    return new IterableReadable(iterable, options);
  }
}

export class IterableReadable extends Readable {
  protected _iterable: IterableInput;

  public constructor(
    iterable: IterableInput,
    options: Stream.ReadableOptions = {},
  ) {
    super({ objectMode: isObjectMode(iterable), ...options });
    this._iterable = iterable;
  }

  public _read(): void {
    if (Array.isArray(this._iterable)) {
      for (const item of this._iterable) this.push(item);
      this.push(null);
    } else if (
      Buffer.isBuffer(this._iterable) ||
      typeof this._iterable === "string"
    ) {
      this.push(this._iterable);
      this.push(null);
    } else if (this._iterable instanceof ArrayBuffer) {
      this.push(Buffer.from(this._iterable));
      this.push(null);
    } else if (ArrayBuffer.isView(this._iterable)) {
      const { buffer, byteLength, byteOffset } = this._iterable;
      this.push(Buffer.from(buffer, byteOffset, byteLength));
      this.push(null);
    } else if (isIterable(this._iterable)) {
      const result = this._iterable[Symbol.iterator]().next();
      this.push(!result.done ? result.value : null);
    } else if (isAsyncIterable(this._iterable)) {
      this._iterable[Symbol.asyncIterator]()
        .next()
        .then((result) => {
          this.push(!result.done ? result.value : null);
        })
        .catch((error) => {
          this.destroy(error);
        });
    } else {
      Promise.resolve(this._iterable.next())
        .then((result) => {
          this.push(!result.done ? result.value : null);
        })
        .catch((error) => {
          this.destroy(error);
        });
    }
  }
}

export function isAsyncIterable<T>(
  iterable: unknown,
): iterable is AsyncIterable<T> {
  return Symbol.asyncIterator in (iterable as AsyncIterable<T>);
}

export function isIterable<T>(iterable: unknown): iterable is Iterable<T> {
  return Symbol.asyncIterator in (iterable as Iterable<T>);
}

export function isObjectMode(iterable: IterableInput): boolean {
  return (
    !Buffer.isBuffer(iterable) &&
    !ArrayBuffer.isView(iterable) &&
    !(iterable instanceof ArrayBuffer) &&
    typeof iterable !== "string"
  );
}

export function isReadable(readable: unknown): readable is Readable {
  return "read" in (readable as Readable);
}

export type IterableInput =
  | Array<unknown>
  | ArrayBuffer
  | AsyncIterable<unknown>
  | AsyncIterator<unknown>
  | Buffer
  | Iterable<unknown>
  | Iterator<unknown>
  | NodeJS.TypedArray
  | string;
