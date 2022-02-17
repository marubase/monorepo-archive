import stream from "readable-stream";

export class IterableReadable extends stream.Readable {
  protected _iterable: stream.IterableInput;

  public constructor(
    iterable: stream.IterableInput,
    options: stream.ReadableOptions,
  ) {
    super({ objectMode: isObjectMode(iterable), ...options });
    this._iterable = iterable;
  }

  public _read(): void {
    if (Array.isArray(this._iterable)) {
      for (const item of this._iterable) this.push(item);
      this.push(null);
    } else if (ArrayBuffer.isView(this._iterable)) {
      const { buffer, byteLength, byteOffset } = this._iterable;
      this.push(Buffer.from(buffer, byteOffset, byteLength));
      this.push(null);
    } else if (this._iterable instanceof ArrayBuffer) {
      this.push(Buffer.from(this._iterable));
      this.push(null);
    } else if (typeof this._iterable === "string") {
      this.push(this._iterable);
      this.push(null);
    } else if (isAsyncIterable(this._iterable)) {
      this._iterable[Symbol.asyncIterator]()
        .next()
        .then(
          (result) => this.push(!result.done ? result.value : null),
          (error) => this.destroy(error),
        );
    } else if (isIterable(this._iterable)) {
      const result = this._iterable[Symbol.iterator]().next();
      this.push(!result.done ? result.value : null);
    } else {
      Promise.resolve(this._iterable.next()).then(
        (result) => this.push(!result.done ? result.value : null),
        (error) => this.destroy(error),
      );
    }
  }
}

function isAsyncIterable<T>(iterable: unknown): iterable is AsyncIterable<T> {
  return Symbol.asyncIterator in (iterable as AsyncIterable<T>);
}

function isIterable<T>(iterable: unknown): iterable is Iterable<T> {
  return Symbol.iterator in (iterable as Iterable<T>);
}

function isObjectMode(iterable: stream.IterableInput): boolean {
  return (
    !ArrayBuffer.isView(iterable) &&
    !(iterable instanceof ArrayBuffer) &&
    typeof iterable !== "string"
  );
}
