import { decode } from "@marubase/collator";

export class RangeIterable<Key, Value> implements AsyncIterable<[Key, Value]> {
  protected _fdbRange: AsyncGenerator<[Buffer, Buffer]>;

  public constructor(fdbRange: AsyncGenerator<[Buffer, Buffer]>) {
    this._fdbRange = fdbRange;
  }

  public [Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[Key, Value]>> {
    const fdbCursor = await this._fdbRange.next();
    if (fdbCursor.done) return { done: true, value: undefined };

    const [fdbKey, fdbValue] = fdbCursor.value;
    const key = decode(fdbKey) as Key;
    const value = decode(fdbValue) as Value;
    return { done: false, value: [key, value] };
  }
}
