import { ReadTransactionContract } from "./read-transaction.js";
import { StorageFactory } from "./storage.contract.js";

export interface ReadBucketContract {
  readonly factory: StorageFactory;

  readonly name: string;

  readonly transaction: ReadTransactionContract;

  get(key: unknown, defaultValue?: unknown): Promise<unknown>;

  getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]>;
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};
