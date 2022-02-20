import { Readable } from "stream";
import { MessageInterface } from "../contracts/message.contract.js";
import { Multipart } from "../multipart.js";

export function toMultipart(
  boundary: string,
  stream: Readable,
): Promise<Multipart>;
export function toMultipart(
  boundary: string,
  parts: MessageInterface[],
): Promise<Multipart>;
export async function toMultipart(
  boundary: string,
  partsOrStream: MessageInterface[] | Readable,
): Promise<Multipart> {
  return new Multipart(partsOrStream).setBoundary(boundary);
}
