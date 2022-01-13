export class VersionstampValue {
  public static create(code: number, value?: Buffer): VersionstampValue {
    return new VersionstampValue(code, value as Buffer);
  }

  public constructor(public code: number, public value?: Buffer) {}

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
