export interface ReadBucketContract {
  get(key: unknown): Promise<unknown>;

  getRange(
    startKey: unknown,
    endKey: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;

  watch(key: unknown): Watch;
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

  watch(key: unknown): Watch;
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

export type Watch = {
  readonly promise: Promise<boolean>;
  cancel(): void;
};
