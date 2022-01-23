import { decode, encode, versionstamp } from "@marubase/collator";
import {
  ReadTransactionContract,
  StorageContract,
  StorageError,
  StorageFactory,
  TransactionCast,
  TransactionOrder,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { Database } from "lmdb";
import { MutationCounter } from "./mutation-counter.js";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";

export class WriteTransaction implements WriteTransactionContract {
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly scope: string[];

  public readonly storage: StorageContract;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  protected _mutationCounter?: Buffer;

  protected _transactionID = 0;

  public constructor(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.storage = storage;
    this.scope = scope;
    this._lmdbDatabase = lmdbDatabase;
  }

  public bucket<Key, Value>(name: string): WriteBucketContract<Key, Value> {
    if (this.scope.indexOf(name) < 0) {
      const scopes = this.scope.join(", ");
      const context = `Running write transaction in "${name}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this.factory.createWriteBucket(
      this.factory,
      this,
      name,
      this._lmdbDatabase,
    );
  }

  public commitID(): Buffer {
    if (!Buffer.isBuffer(this._mutationCounter)) {
      const encodedCounterBinary =
        this._lmdbDatabase.get(MutationCounter.key) ||
        Buffer.from("1a0000000000000000000003", "hex");
      const counterBinary = decode(encodedCounterBinary) as Buffer;
      const counter = MutationCounter.toBigInt(counterBinary) + 1n;

      const reCounterBinary = MutationCounter.toBinary(counter);
      const reEncodedCounterBinary = encode(reCounterBinary) as Buffer;
      this._lmdbDatabase.put(MutationCounter.key, reEncodedCounterBinary);
      this._mutationCounter = reCounterBinary;
    }
    return this._mutationCounter as Buffer;
  }

  public nextID(): number {
    return this._transactionID++;
  }

  public snapshot(): ReadTransactionContract {
    return this.factory.createReadTransaction(
      this.factory,
      this.storage,
      this.scope,
      this._lmdbDatabase,
    );
  }
}
