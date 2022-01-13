export class FloatValue {
  public static create(value: unknown, type: FloatType): FloatValue {
    return !(value instanceof FloatValue)
      ? new FloatValue(value as number, type)
      : value;
  }

  public constructor(public value: number, public type: FloatType) {}
}

export type FloatType = "float32" | "float64";
