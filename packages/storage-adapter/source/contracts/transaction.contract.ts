import {
  asc,
  desc,
  float32,
  float64,
  int16,
  int32,
  int64,
  int8,
  uint16,
  uint32,
  uint64,
  uint8,
  versionstamp,
} from "@marubase/collator";

export interface ReadBucketContract {
  get(key: unknown): Promise<unknown>;

  getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;
}

export interface ReadTransactionContract {
  readonly cast: {
    float32: typeof float32;
    float64: typeof float64;
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

  bucket(bucketName: string): ReadBucketContract;
}

export interface WriteBucketContract {
  clear(key: unknown): void;

  clearRange(start: unknown, end: unknown): void;

  get(key: unknown): Promise<unknown>;

  getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;

  set(key: unknown, value: unknown): void;
}

export interface WriteTransactionContract {
  readonly versionstamp: typeof versionstamp;

  bucket(bucketName: string): WriteBucketContract;

  nextID(): number;

  snapshot(): ReadTransactionContract;
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};
