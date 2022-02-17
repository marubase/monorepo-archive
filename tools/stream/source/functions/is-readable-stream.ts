import stream from "readable-stream";

export function isReadableStream(
  readable: unknown,
): readable is stream.Readable {
  return (
    typeof readable === "object" &&
    readable !== null &&
    "destroy" in (readable as stream.Readable) &&
    "pause" in (readable as stream.Readable) &&
    "read" in (readable as stream.Readable) &&
    "resume" in (readable as stream.Readable) &&
    "setEncoding" in (readable as stream.Readable)
  );
}
