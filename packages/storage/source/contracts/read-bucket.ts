import { ReadTransactionContract } from "./read-transaction.js";
import { StorageContract, StorageFactory } from "./storage.contract.js";

export interface ReadBucketContract<Key, Value> {
  readonly factory: StorageFactory;

  readonly mutations?: Promise<void>[];

  readonly name: string;

  readonly transaction: ReadTransactionContract;

  readonly watchers?: WatcherFn[];

  get(key: Key, defaultValue?: Value): Promise<Value | undefined>;

  getBinary(key: Key): Promise<Buffer | undefined>;

  getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]>;

  watch(key: Key): Watch;
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};

export type Watch = {
  promise: Promise<boolean>;
  cancel(): void;
};

export type WatcherFn = (storage: StorageContract) => Promise<void>;

export type WatchWithValue<Value> = Watch & {
  value: Value | undefined;
};
