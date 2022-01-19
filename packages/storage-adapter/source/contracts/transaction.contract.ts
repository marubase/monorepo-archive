export interface ReadBucketContract {
  get(key: unknown): Promise<unknown>;

  getRange(
    startKey: unknown,
    endKey: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;
}

export interface ReadTransactionContract {
  bucket(bucketName: string): ReadBucketContract;
}

export interface WriteBucketContract {
  clear(key: unknown): void;

  clearRange(startKey: unknown, endKey: unknown): void;

  get(key: unknown): Promise<unknown>;

  getRange(
    startKey: unknown,
    endKey: unknown,
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
