import { decode, encode, versionstamp } from "@marubase/collator";
import {
  ReadTransactionContract,
  StorageError,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage-adapter";
import { MutationCounter } from "./mutation-counter.js";
import { ReadTransaction } from "./read-transaction.js";

export class WriteTransaction
  extends ReadTransaction
  implements WriteTransactionContract
{
  public readonly versionstamp = versionstamp;

  protected _mutationCounter?: Buffer;

  protected _transactionID = 0;

  public bucket(bucketName: string): WriteBucketContract {
    if (this._bucketNames.indexOf(bucketName) < 0) {
      const scopes = this._bucketNames.join(", ");
      const context = `Running read transaction in "${bucketName}".`;
      const problem = `Transaction out of scope.`;
      const solution = `Please run transaction in ${scopes}.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    return this._factory.createWriteBucket(
      this._lmdbDatabase,
      bucketName,
      this._factory,
      this._versionstampFn.bind(this),
    );
  }

  public nextID(): number {
    return this._transactionID++;
  }

  public snapshot(): ReadTransactionContract {
    return this._factory.createReadTransaction(
      this._lmdbDatabase,
      this._bucketNames,
      this._factory,
    );
  }

  protected _versionstampFn(): Buffer {
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
}
