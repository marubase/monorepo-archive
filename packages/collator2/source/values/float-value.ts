export class FloatValue {
  public static create(value: unknown, type: FloatType): FloatValue {
    return !(value instanceof FloatValue)
      ? new FloatValue(value as number, type)
      : value;
  }

  public type: FloatType;

  public value: number;

  public constructor(value: number, type: FloatType) {
    this.type = type;
    this.value = value;
  }
}

export type FloatType = "float32" | "float64";
