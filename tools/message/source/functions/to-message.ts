import { isReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import { MessageBuffer, MessageData } from "../contracts/message.contract.js";
import { Message } from "../message.js";

export function toMessage(stream: Readable): Promise<Message>;
export function toMessage(
  body: MessageBuffer | MessageData,
  headers?: Map<string, string> | [string, string][],
): Promise<Message>;
export async function toMessage(
  bodyOrStream: MessageData | MessageBuffer | Readable,
  headers: Map<string, string> | [string, string][] = new Map(),
): Promise<Message> {
  if (!isReadable(bodyOrStream)) {
    const _body = bodyOrStream;
    const _headers = new Map(headers);
    return new Message().setHeaders(_headers).setBody(_body);
  }

  const _headers = new Map<string, string>();
  const _stream = bodyOrStream;
  const _reader = _stream[Symbol.asyncIterator]();

  let buffer = Buffer.from([]);
  let chunk = await _reader.next();
  for (; !chunk.done; chunk = await _reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const separator = "\r\n\r\n";
    const separatorIndex = buffer.indexOf(separator);
    if (separatorIndex < 0) continue;

    const headers = buffer.subarray(0, separatorIndex).toString();
    for (const header of headers.split("\r\n")) {
      const [key, value] = header.split(":");
      _headers.set(key.trim(), value.trim());
    }
    buffer = buffer.subarray(separatorIndex + separator.length);
    break;
  }

  const _body = new Readable({
    read() {
      _reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
    },
  });

  _body.push(buffer);
  return new Message().setHeaders(_headers).setBody(_body);
}
