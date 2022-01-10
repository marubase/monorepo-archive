import { MetaValue } from "../values/meta-value.js";

function toBufferFactory(ascending: boolean): ToBufferFn {
  return (hex) => {
    const buffer = Buffer.from(hex, "hex");
    return !ascending
      ? Buffer.from(buffer.map((b) => b ^ 255))
      : Buffer.from(hex, "hex");
  };
}

function toValueFactory(ascending: boolean): ToValueFn {
  return (value) => MetaValue.create(value, ascending);
}

export function mirrorRun(testFn: TestFn): void {
  testFn(true, toBufferFactory(true), toValueFactory(true));
  testFn(false, toBufferFactory(false), toValueFactory(false));
}

export type TestFn = (
  ascending: boolean,
  toBuffer: ToBufferFn,
  toValue: ToValueFn,
) => void;

export type ToBufferFn = (hex: string) => Buffer;

export type ToValueFn = (value: unknown) => MetaValue;
