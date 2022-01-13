import {
  asc,
  desc,
  int16,
  int32,
  int64,
  int8,
  uint16,
  uint32,
  uint64,
  uint8,
} from "@marubase/collator";

export interface BucketReadContract {
  readonly cast: {
    int16: typeof int16;
    int32: typeof int32;
    int64: typeof int64;
    int8: typeof int8;
    uint16: typeof uint16;
    uint32: typeof uint32;
    uint64: typeof uint64;
    uint8: typeof uint8;
  };

  readonly order: {
    asc: typeof asc;
    desc: typeof desc;
  };

  get(key: unknown): Promise<unknown>;

  getRange(
    startKey: unknown,
    endKey: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};
