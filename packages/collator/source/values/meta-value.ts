import { FloatValue } from "./float-value.js";
import { IntegerValue } from "./integer-value.js";
import { VersionstampValue } from "./versionstamp-value.js";

export class MetaValue {
  public static create(value: unknown, ascending: boolean): MetaValue {
    return !(value instanceof MetaValue)
      ? new MetaValue(value, ascending)
      : value;
  }

  public type: string;

  public constructor(public value: unknown, public ascending: boolean) {
    if (Array.isArray(value)) this.type = "array";
    else if (Buffer.isBuffer(value)) this.type = "buffer";
    else if (value instanceof Date) this.type = "date";
    else if (value instanceof FloatValue) this.type = "float";
    else if (value instanceof IntegerValue) this.type = "integer";
    else if (value instanceof VersionstampValue) this.type = "versionstamp";
    else if (value === null) this.type = "null";
    else this.type = typeof value;
  }
}
