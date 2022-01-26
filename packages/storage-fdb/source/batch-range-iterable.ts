import { decode } from "@marubase/collator";

export class BatchRangeIterable<Key, Value>
  implements AsyncIterable<[Key, Value]>
{
  protected _fdbBatchRange: AsyncGenerator<[Buffer, Buffer][]>;

  protected _fdbRange?: [Buffer, Buffer][];

  protected _fdbRangeIndex = 0;

  public constructor(fdbBatchRange: AsyncGenerator<[Buffer, Buffer][]>) {
    this._fdbBatchRange = fdbBatchRange;
  }

  public [Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[Key, Value]>> {
    if (
      typeof this._fdbRange === "undefined" ||
      this._fdbRangeIndex + 1 > this._fdbRange.length
    ) {
      const fdbBatchCursor = await this._fdbBatchRange.next();
      if (fdbBatchCursor.done) return { done: true, value: undefined };
      this._fdbRange = fdbBatchCursor.value;
      this._fdbRangeIndex = 0;
      return this.next();
    }

    const [fdbKey, fdbValue] = this._fdbRange[this._fdbRangeIndex++];
    const key = decode(fdbKey) as Key;
    const value = decode(fdbValue) as Value;
    return { done: false, value: [key, value] };
  }
}
