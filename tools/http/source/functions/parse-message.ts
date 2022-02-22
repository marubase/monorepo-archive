import { Readable } from "stream";

export async function parseMessage(
  stream: Readable,
): Promise<[Map<string, string>, Readable]> {
  const headers = new Map<string, string>();
  const reader = stream[Symbol.asyncIterator]();

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const separator = "\r\n\r\n";
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const rawHeaders = buffer.subarray(0, separatorIndex).toString();
    for (const rawHeader of rawHeaders.split("\r\n")) {
      const [key, value] = rawHeader.split(":");
      headers.set(key.trim(), value.trim());
    }
    buffer = buffer.subarray(separatorIndex + separator.length);
    break;
  }

  const body = new Readable({
    read() {
      reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
    },
  });

  body.push(buffer);
  return [headers, body];
}
