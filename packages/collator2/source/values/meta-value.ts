import { FloatValue } from "./float-value.js";
import { IntegerValue } from "./integer-value.js";
import { VersionStamp } from "./version-stamp.js";

export class MetaValue {
  public static create(value: unknown, ascending: boolean): MetaValue {
    return !(value instanceof MetaValue)
      ? new MetaValue(value, ascending)
      : value;
  }

  public ascending: boolean;

  public type: string;

  public value: unknown;

  public constructor(value: unknown, ascending: boolean) {
    this.ascending = ascending;
    this.value = value;

    if (typeof value !== "object") this.type = typeof value;
    if (Array.isArray(value)) this.type = "array";
    else if (Buffer.isBuffer(value)) this.type = "buffer";
    else if (value instanceof Date) this.type = "date";
    else if (value instanceof FloatValue) this.type = "float";
    else if (value instanceof IntegerValue) this.type = "integer";
    else if (value instanceof VersionStamp) this.type = "versionstamp";
    else if (value === null) this.type = "null";
    else this.type = typeof value;
  }
}
