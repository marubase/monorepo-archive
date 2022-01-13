import { CodeTable } from "../code-table.js";
import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";

export class ComplexCodec extends BaseCodec {
  public handler: Record<number, Handler> = {};

  public types: Record<string, CodecInterface> = {};

  public constructor(table: typeof CodeTable) {
    super(table);
    const { ANULL, DNULL } = this.table;
    [ANULL, DNULL].forEach((code) =>
      this.registerHandler(code[0], (context) => {
        const { cursor, key } = context;
        if (Array.isArray(cursor)) cursor.push(null);
        else (cursor as Record<string, unknown>)[key.value] = null;
      }),
    );

    const { AUNDEF, DUNDEF } = this.table;
    [AUNDEF, DUNDEF].forEach((code) =>
      this.registerHandler(code[0], (context) => {
        const { cursor, key } = context;
        if (Array.isArray(cursor)) cursor.push(undefined);
        else (cursor as Record<string, unknown>)[key.value] = undefined;
        return context;
      }),
    );
  }

  public decode(binary: Buffer): unknown {
    const { AASTART, AAEND, DASTART, DAEND } = this.table;
    const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
    const { DOSTART, DOCOLON, DOCOMMA, DOEND } = this.table;

    const data: unknown[] = [];
    const cursorStack = [data];
    const context = {
      cursor: cursorStack[cursorStack.length - 1],
      index: 0,
      key: { target: false, value: "" },
    };

    const { byteLength } = binary;
    for (; context.index < byteLength; context.index++) {
      context.cursor = cursorStack[cursorStack.length - 1];
      const { cursor, index, key } = context;

      if (binary[index] in this.handler) {
        this.handler[binary[index]](context, binary);
        continue;
      }

      if (AASTART[0] === binary[index] || DASTART[0] === binary[index]) {
        if (Array.isArray(cursor)) {
          cursor.push([]);
          cursorStack.push(cursor[cursor.length - 1]);
        } else {
          (cursor as Record<string, unknown>)[key.value] = [];
          cursorStack.push(cursor[key.value]);
        }
        continue;
      }
      if (AAEND[0] === binary[index] || DAEND[0] === binary[index]) {
        cursorStack.pop();
        continue;
      }

      if (AOSTART[0] === binary[index] || DOSTART[0] === binary[index]) {
        if (Array.isArray(cursor)) {
          cursor.push({});
          cursorStack.push(cursor[cursor.length - 1]);
        } else {
          (cursor as Record<string, unknown>)[key.value] = {};
          cursorStack.push(cursor[key.value]);
        }
        key.target = true;
        continue;
      }
      if (AOCOLON[0] === binary[index] || DOCOLON[0] === binary[index]) {
        context.key.target = false;
        continue;
      }
      if (AOCOMMA[0] === binary[index] || DOCOMMA[0] === binary[index]) {
        context.key.target = true;
        continue;
      }
      if (AOEND[0] === binary[index] || DOEND[0] === binary[index]) {
        context.key.target = false;
        cursorStack.pop();
        continue;
      }
    }
    return data[0];
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    if (this.types[meta.type])
      return this.types[meta.type].encode(binaries, meta);
    if (meta.type === "array") return this.encodeArray(binaries, meta);
    if (meta.type === "object") return this.encodeObject(binaries, meta);
    if (meta.type === "null") return this.encodeNull(binaries, meta);
    return this.encodeUndefined(binaries, meta);
  }

  public register(serviceFn: (complex: ComplexCodec) => void): ComplexCodec {
    serviceFn(this);
    return this;
  }

  public registerHandler(prefix: number, handler: Handler): ComplexCodec {
    this.handler[prefix] = handler;
    return this;
  }

  public registerType(type: string, codec: CodecInterface): ComplexCodec {
    this.types[type] = codec;
    return this;
  }

  protected encodeArray(
    binaries: EncodeBuffer[],
    meta: MetaValue,
  ): EncodeBuffer[] {
    if (meta.ascending) {
      const { AASTART, AACOMMA, AAEND } = this.table;
      binaries.push(AASTART);

      const tuple = meta.value as unknown[];
      const tupleLength = tuple.length;
      for (let index = 0; index < tupleLength; index++) {
        const item = tuple[index];
        const metaItem = MetaValue.create(item, meta.ascending);
        this.encode(binaries, metaItem);
        if (index < tupleLength - 1) binaries.push(AACOMMA);
      }
      binaries.push(AAEND);
      return binaries;
    } else {
      const { DASTART, DACOMMA, DAEND } = this.table;
      binaries.push(DASTART);

      const tuple = meta.value as unknown[];
      const tupleLength = tuple.length;
      for (let index = 0; index < tupleLength; index++) {
        const item = tuple[index];
        const metaItem = MetaValue.create(item, meta.ascending);
        this.encode(binaries, metaItem);
        if (index < tupleLength - 1) binaries.push(DACOMMA);
      }
      binaries.push(DAEND);
      return binaries;
    }
  }

  protected encodeNull(
    binaries: EncodeBuffer[],
    meta: MetaValue,
  ): EncodeBuffer[] {
    if (meta.ascending) {
      const { ANULL } = this.table;
      binaries.push(ANULL);
      return binaries;
    } else {
      const { DNULL } = this.table;
      binaries.push(DNULL);
      return binaries;
    }
  }

  protected encodeObject(
    binaries: EncodeBuffer[],
    meta: MetaValue,
  ): EncodeBuffer[] {
    if (meta.ascending) {
      const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
      binaries.push(AOSTART);

      const items = meta.value as Record<string, unknown>;
      const itemEntries = Object.entries(items);
      const itemLength = itemEntries.length;
      for (let index = 0; index < itemLength; index++) {
        const [key, item] = itemEntries[index];
        const metaKey = MetaValue.create(key, meta.ascending);
        const metaItem = MetaValue.create(item, meta.ascending);
        this.types.string.encode(binaries, metaKey);
        binaries.push(AOCOLON);
        this.encode(binaries, metaItem);
        if (index < itemLength - 1) binaries.push(AOCOMMA);
      }
      binaries.push(AOEND);
      return binaries;
    } else {
      const { DOSTART, DOCOLON, DOCOMMA, DOEND } = this.table;
      binaries.push(DOSTART);

      const items = meta.value as Record<string, unknown>;
      const itemEntries = Object.entries(items);
      const itemLength = itemEntries.length;
      for (let index = 0; index < itemLength; index++) {
        const [key, item] = itemEntries[index];
        const metaKey = MetaValue.create(key, meta.ascending);
        const metaItem = MetaValue.create(item, meta.ascending);
        this.types.string.encode(binaries, metaKey);
        binaries.push(DOCOLON);
        this.encode(binaries, metaItem);
        if (index < itemLength - 1) binaries.push(DOCOMMA);
      }
      binaries.push(DOEND);
      return binaries;
    }
  }

  protected encodeUndefined(
    binaries: EncodeBuffer[],
    meta: MetaValue,
  ): EncodeBuffer[] {
    if (meta.ascending) {
      const { AUNDEF } = this.table;
      binaries.push(AUNDEF);
      return binaries;
    } else {
      const { DUNDEF } = this.table;
      binaries.push(DUNDEF);
      return binaries;
    }
  }
}

export type CodecInterface = {
  decode(binary: Buffer): unknown;
  encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[];
};

export type Context = {
  cursor: unknown;
  index: number;
  key: ContextKey;
};

export type ContextKey = {
  target: boolean;
  value: string;
};

export type EncodeBuffer = Buffer | { buffer: Buffer; type: string };

export type Handler = (context: Context, binary: Buffer) => void;
