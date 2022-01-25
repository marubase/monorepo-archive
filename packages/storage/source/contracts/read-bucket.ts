import { ReadTransactionContract } from "./read-transaction.js";
import { StorageFactory } from "./storage.contract.js";

export interface ReadBucketContract<Key, Value> {
  readonly factory: StorageFactory;

  readonly mutations?: Promise<void>[];

  readonly name: string;

  readonly transaction: ReadTransactionContract;

  readonly watches?: Watch[];

  get(key: Key, defaultValue?: Value): Promise<Value | undefined>;

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

export type WatchWithValue<Value> = Watch & {
  value: Value | undefined;
};
