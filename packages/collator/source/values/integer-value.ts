export class IntegerValue {
  public static create(value: unknown, type: IntegerType): IntegerValue {
    return !(value instanceof IntegerValue)
      ? new IntegerValue(value as bigint | number, type)
      : value;
  }

  public constructor(public value: bigint | number, public type: IntegerType) {}
}

export type IntegerType =
  | "int8"
  | "int16"
  | "int32"
  | "int64"
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64";
