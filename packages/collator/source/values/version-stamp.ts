export class VersionStamp {
  public static create(code: number, value?: Buffer): VersionStamp {
    return new VersionStamp(code, value as Buffer);
  }

  public code: number;

  public value: Buffer;

  public constructor(code: number, value: Buffer) {
    this.code = code;
    this.value = value;
  }

  public get buffer(): Buffer {
    const buffer = Buffer.alloc(12);
    if (Buffer.isBuffer(this.value)) this.value.copy(buffer);
    buffer.writeUInt16BE(this.code, 10);
    return buffer;
  }

  public isBounded(): boolean {
    return Buffer.isBuffer(this.value);
  }
}
