import stream from "readable-stream";

export function isWritableStream(
  writable: unknown,
): writable is stream.Writable {
  return (
    typeof writable === "object" &&
    writable !== null &&
    "cork" in (writable as stream.Writable) &&
    "end" in (writable as stream.Writable) &&
    "setDefaultEncoding" in (writable as stream.Writable) &&
    "uncork" in (writable as stream.Writable) &&
    "write" in (writable as stream.Writable)
  );
}
