import { decode } from "@marubase/collator";

export class RangeIterable implements AsyncIterable<[unknown, unknown]> {
  protected _fdbRange: AsyncGenerator<[Buffer, Buffer]>;

  public constructor(fdbRange: AsyncGenerator<[Buffer, Buffer]>) {
    this._fdbRange = fdbRange;
  }

  public [Symbol.asyncIterator](): AsyncIterator<[unknown, unknown]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[unknown, unknown]>> {
    const fdbCursor = await this._fdbRange.next();
    if (fdbCursor.done) return { done: true, value: undefined };

    const [fdbKey, fdbValue] = fdbCursor.value;
    const [, key] = decode(fdbKey) as [string, unknown];
    const value = decode(fdbValue);
    return { done: false, value: [key, value] };
  }
}
