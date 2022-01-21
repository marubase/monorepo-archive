import { ReadTransactionContract } from "./read-transaction.js";

export interface ReadBucketContract {
  readonly name: string;

  readonly transaction: ReadTransactionContract;

  get(key: unknown): Promise<unknown>;

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
