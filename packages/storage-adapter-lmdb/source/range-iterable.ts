import { decode } from "@marubase/collator";
import { ArrayLikeIterable } from "lmdb";

export class RangeIterable implements AsyncIterable<[unknown, unknown]> {
  protected _lmdbRange: Iterator<{ key: Buffer; value: Buffer }>;

  public constructor(
    lmdbRange: ArrayLikeIterable<{ key: Buffer; value: Buffer }>,
  ) {
    this._lmdbRange = lmdbRange[Symbol.iterator]();
  }

  public [Symbol.asyncIterator](): AsyncIterator<[unknown, unknown]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[unknown, unknown]>> {
    const lmdbCursor = this._lmdbRange.next();
    if (lmdbCursor.done) return { done: true, value: undefined };

    const { key: lmdbKey, value: lmdbValue } = lmdbCursor.value;
    const [, key] = decode(lmdbKey) as [string, unknown];
    const value = decode(lmdbValue);
    return { done: false, value: [key, value] };
  }
}
