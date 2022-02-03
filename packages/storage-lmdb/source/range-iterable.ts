import { decode } from "@marubase/storage";
import { ArrayLikeIterable } from "lmdb";

export class RangeIterable<Key, Value> implements AsyncIterable<[Key, Value]> {
  protected _lmdbRange: Iterator<{ key: Buffer; value: Buffer }>;

  public constructor(
    lmdbRange: ArrayLikeIterable<{ key: Buffer; value: Buffer }>,
  ) {
    this._lmdbRange = lmdbRange[Symbol.iterator]();
  }

  public [Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[Key, Value]>> {
    const lmdbCursor = this._lmdbRange.next();
    if (lmdbCursor.done) return { done: true, value: undefined };

    const { key: lmdbKey, value: lmdbValue } = lmdbCursor.value;
    const [, key] = decode(lmdbKey) as [string, Key];
    const value = decode(lmdbValue) as Value;
    return { done: false, value: [key, value] };
  }
}
