import { CodeTable } from "./code-table.js";
import { BooleanCodec } from "./codecs/boolean-codec.js";
import { BufferCodec } from "./codecs/buffer-codec.js";
import { ComplexCodec } from "./codecs/complex-codec.js";
import { DateCodec } from "./codecs/date-codec.js";
import { FloatCodec } from "./codecs/float-codec.js";
import { IntegerCodec } from "./codecs/integer-codec.js";
import { StringCodec } from "./codecs/string-codec.js";
import { VersionCodec } from "./codecs/version-codec.js";
import { Collator } from "./collator.js";

const codec = new ComplexCodec(CodeTable);
codec.register(BooleanCodec.service);
codec.register(IntegerCodec.service);
codec.register(FloatCodec.service);
codec.register(DateCodec.service);
codec.register(BufferCodec.service);
codec.register(StringCodec.service);
codec.register(VersionCodec.service);

const collator = new Collator(codec);
export default collator;

export const decode = collator.decode.bind(collator);
export const encode = collator.encode.bind(collator);

export const asc = collator.asc.bind(collator);
export const desc = collator.desc.bind(collator);

export const float32 = collator.float32.bind(collator);
export const float64 = collator.float64.bind(collator);
export const int8 = collator.int8.bind(collator);
export const int16 = collator.int16.bind(collator);
export const int32 = collator.int32.bind(collator);
export const int64 = collator.int64.bind(collator);
export const uint8 = collator.uint8.bind(collator);
export const uint16 = collator.uint16.bind(collator);
export const uint32 = collator.uint32.bind(collator);
export const uint64 = collator.uint64.bind(collator);
export const versionstamp = collator.versionstamp.bind(collator);

export * from "./code-table.js";
export * from "./codecs/index.js";
export * from "./collator.js";
export * from "./errors/index.js";
export * from "./values/index.js";
