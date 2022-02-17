import stream from "readable-stream";

export function isDuplexStream(duplex: unknown): duplex is stream.Duplex {
  return (
    typeof duplex === "object" &&
    duplex !== null &&
    "cork" in (duplex as stream.Writable) &&
    "destroy" in (duplex as stream.Duplex) &&
    "end" in (duplex as stream.Writable) &&
    "pause" in (duplex as stream.Duplex) &&
    "read" in (duplex as stream.Duplex) &&
    "resume" in (duplex as stream.Duplex) &&
    "setDefaultEncoding" in (duplex as stream.Writable) &&
    "setEncoding" in (duplex as stream.Duplex) &&
    "uncork" in (duplex as stream.Writable) &&
    "write" in (duplex as stream.Writable)
  );
}
