export class IntegerValue {
  public static create(value: unknown, type: IntegerType): IntegerValue {
    return !(value instanceof IntegerValue)
      ? new IntegerValue(value as bigint | number, type)
      : value;
  }

  public type: IntegerType;

  public value: bigint | number;

  public constructor(value: bigint | number, type: IntegerType) {
    this.type = type;
    this.value = value;
  }
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
