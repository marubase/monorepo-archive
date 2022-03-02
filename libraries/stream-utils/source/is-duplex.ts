import { Duplex } from "stream";

export function isDuplex(input: unknown): input is Duplex {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.asyncIterator in (input as Duplex) &&
    "cork" in (input as Duplex) &&
    "destroy" in (input as Duplex) &&
    "end" in (input as Duplex) &&
    "isPaused" in (input as Duplex) &&
    "pause" in (input as Duplex) &&
    "pipe" in (input as Duplex) &&
    "push" in (input as Duplex) &&
    "read" in (input as Duplex) &&
    "resume" in (input as Duplex) &&
    "setDefaultEncoding" in (input as Duplex) &&
    "setEncoding" in (input as Duplex) &&
    "uncork" in (input as Duplex) &&
    "unpipe" in (input as Duplex) &&
    "unshift" in (input as Duplex) &&
    "wrap" in (input as Duplex) &&
    "write" in (input as Duplex)
  );
}
