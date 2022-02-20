import { Readable } from "stream";

export function isReadable(readable: unknown): readable is Readable {
  return (
    typeof readable === "object" &&
    readable !== null &&
    "destroy" in (readable as Readable) &&
    "pause" in (readable as Readable) &&
    "read" in (readable as Readable) &&
    "resume" in (readable as Readable) &&
    "setEncoding" in (readable as Readable)
  );
}
