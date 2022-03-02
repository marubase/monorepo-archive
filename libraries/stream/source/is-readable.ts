import { Readable } from "stream";

export function isReadable(input: unknown): input is Readable {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.asyncIterator in (input as Readable) &&
    "destroy" in (input as Readable) &&
    "isPaused" in (input as Readable) &&
    "pause" in (input as Readable) &&
    "pipe" in (input as Readable) &&
    "push" in (input as Readable) &&
    "read" in (input as Readable) &&
    "resume" in (input as Readable) &&
    "setEncoding" in (input as Readable) &&
    "unpipe" in (input as Readable) &&
    "unshift" in (input as Readable) &&
    "wrap" in (input as Readable)
  );
}
