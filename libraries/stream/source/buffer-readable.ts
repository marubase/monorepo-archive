import { Readable, ReadableOptions } from "stream";

export class BufferReadable extends Readable {
  public static accept(
    input: unknown,
  ): input is ArrayBuffer | NodeJS.TypedArray | string {
    return (
      input instanceof ArrayBuffer ||
      ArrayBuffer.isView(input) ||
      typeof input === "string"
    );
  }

  protected _buffer: Buffer;

  public constructor(
    input: ArrayBuffer | NodeJS.TypedArray | string,
    options: ReadableOptions,
  ) {
    super({ ...options });

    if (input instanceof ArrayBuffer) {
      this._buffer = Buffer.from(input);
    } else if (ArrayBuffer.isView(input)) {
      const { buffer, byteLength, byteOffset } = input;
      this._buffer = Buffer.from(buffer, byteOffset, byteLength);
    } else {
      this._buffer = Buffer.from(input, "utf8");
    }
  }

  public _read(): void {
    this.push(this._buffer);
    this.push(null);
  }
}
