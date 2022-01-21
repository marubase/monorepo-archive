import {
  float32,
  float64,
  int16,
  int32,
  int64,
  int8,
  uint16,
  uint32,
  uint64,
  uint8,
} from "@marubase/collator";

export type TransactionCast = {
  float32: typeof float32;
  float64: typeof float64;
  int16: typeof int16;
  int32: typeof int32;
  int64: typeof int64;
  int8: typeof int8;
  uint16: typeof uint16;
  uint32: typeof uint32;
  uint64: typeof uint64;
  uint8: typeof uint8;
};
