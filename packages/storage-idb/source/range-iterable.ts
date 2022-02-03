import { decode, RangeOptions } from "@marubase/storage";
import { IDBPCursorWithValueIteratorValue } from "idb/with-async-ittr";

export class RangeIterable<Key, Value> implements AsyncIterable<[Key, Value]> {
  protected _cursorIndex = 0;

  protected _idbMutations: Promise<void>[];

  protected _idbOptions: Required<RangeOptions>;

  protected _idbRange: AsyncIterableIterator<
    IDBPCursorWithValueIteratorValue<
      unknown,
      string[],
      string,
      unknown,
      "readonly" | "readwrite"
    >
  >;

  protected _mutationsResolved = false;

  public constructor(
    idbRange: AsyncIterableIterator<
      IDBPCursorWithValueIteratorValue<
        unknown,
        string[],
        string,
        unknown,
        "readonly" | "readwrite"
      >
    >,
    idbOptions: Required<RangeOptions>,
    idbMutations: Promise<void>[],
  ) {
    this._idbRange = idbRange;
    this._idbOptions = idbOptions;
    this._idbMutations = idbMutations;
  }

  public [Symbol.asyncIterator](): AsyncIterator<[Key, Value]> {
    return this;
  }

  public async next(): Promise<IteratorResult<[Key, Value]>> {
    if (!this._mutationsResolved) {
      await Promise.all(this._idbMutations);
      this._mutationsResolved = true;
    }

    if (this._idbOptions.limit < ++this._cursorIndex)
      return { done: true, value: undefined };

    const idbCursor = await this._idbRange.next();
    if (idbCursor.done) return { done: true, value: undefined };

    const { key: idbKeyArrayBuffer, value: idbValue } = idbCursor.value;
    const idbKey = Buffer.from(idbKeyArrayBuffer as Uint8Array);
    const key = decode(idbKey) as Key;
    const value = decode(idbValue) as Value;
    return { done: false, value: [key, value] };
  }
}
