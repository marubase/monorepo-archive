import { encode } from "@marubase/collator";

export class MutationCounter {
  public static get key(): Buffer {
    return encode(["_meta", "mutation_counter"]) as Buffer;
  }

  public static toBigInt({ buffer, byteOffset, byteLength }: Buffer): bigint {
    const binary = Buffer.from(buffer, byteOffset, byteLength);
    const denominator = BigInt("0x100000000000000");
    const quotient = BigInt(binary.readUInt16BE());
    const numerator = binary.readBigUInt64BE(2);
    return quotient * denominator + numerator;
  }

  public static toBinary(counter: bigint): Buffer {
    const denominator = BigInt("0x100000000000000");
    const quotient = Number(counter / denominator);
    const numerator = counter % denominator;
    const binary = Buffer.alloc(10);
    binary.writeUInt16BE(quotient);
    binary.writeBigUInt64BE(numerator, 2);
    return binary;
  }
}
