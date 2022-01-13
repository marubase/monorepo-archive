import { EventEmitter } from "node:events";
import { BucketReadContract } from "./bucket-read.contract.js";
import { BucketWriteContract } from "./bucket-write.contract.js";

export interface StorageContract extends EventEmitter {
  readonly started: boolean;

  read(
    bucketNames: string[],
    transactionFn: TransactionFn<BucketReadContract>,
  ): Promise<unknown>;

  restart(): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;

  write(
    bucketNames: string[],
    transactionFn: TransactionFn<BucketWriteContract>,
  ): Promise<unknown>;
}

export type TransactionFn<Bucket extends BucketReadContract> = (
  ...buckets: Bucket[]
) => Promise<unknown>;
