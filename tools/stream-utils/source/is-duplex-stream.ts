import { Duplex, Readable, Writable } from "stream";

export function isDuplexStream(duplex: unknown): duplex is Duplex {
  return (
    typeof duplex === "object" &&
    duplex !== null &&
    "cork" in (duplex as Writable) &&
    "destroy" in (duplex as Readable) &&
    "end" in (duplex as Writable) &&
    "pause" in (duplex as Readable) &&
    "read" in (duplex as Readable) &&
    "resume" in (duplex as Readable) &&
    "setDefaultEncoding" in (duplex as Writable) &&
    "setEncoding" in (duplex as Readable) &&
    "uncork" in (duplex as Writable) &&
    "write" in (duplex as Writable)
  );
}
