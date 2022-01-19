export interface ReadBucketContract {
  get(key: unknown): Promise<unknown>;

  getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;
}

export interface ReadTransactionContract {
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
  bucket(bucketName: string): WriteBucketContract;

  nextID(): number;

  snapshot(): ReadTransactionContract;
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};
