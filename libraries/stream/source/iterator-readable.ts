import { Readable, ReadableOptions } from "stream";

export class IteratorReadable extends Readable {
  public static accept(
    input: unknown,
  ): input is
    | Array<unknown>
    | AsyncIterable<unknown>
    | AsyncIterator<unknown>
    | Iterable<unknown>
    | Iterator<unknown> {
    return (
      Array.isArray(input) ||
      Symbol.asyncIterator in (input as AsyncIterable<unknown>) ||
      Symbol.iterator in (input as Iterable<unknown>) ||
      "next" in (input as AsyncIterator<unknown> | Iterator<unknown>)
    );
  }

  protected _iterator: AsyncIterator<unknown> | Iterator<unknown>;

  public constructor(
    input:
      | Array<unknown>
      | AsyncIterable<unknown>
      | AsyncIterator<unknown>
      | Iterable<unknown>
      | Iterator<unknown>,
    options: ReadableOptions,
  ) {
    super({ ...options, objectMode: true });
    if (Array.isArray(input)) {
      this._iterator = input.values();
    } else if (this._isAsyncIterable(input)) {
      this._iterator = input[Symbol.asyncIterator]();
    } else if (this._isIterable(input)) {
      this._iterator = input[Symbol.iterator]();
    } else {
      this._iterator = input;
    }
  }

  public _read(): void {
    Promise.resolve(this._iterator.next()).then(
      (chunk) => this.push(!chunk.done ? chunk.value : null),
      (error) => this.destroy(error),
    );
  }

  protected _isAsyncIterable(input: unknown): input is AsyncIterable<unknown> {
    return Symbol.asyncIterator in (input as AsyncIterable<unknown>);
  }

  protected _isIterable(input: unknown): input is Iterable<unknown> {
    return Symbol.iterator in (input as Iterable<unknown>);
  }
}
