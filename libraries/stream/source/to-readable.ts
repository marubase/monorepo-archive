import { Readable, ReadableOptions } from "stream";
import { BufferReadable } from "./buffer-readable.js";
import { IteratorReadable } from "./iterator-readable.js";

export function toReadable(
  input: unknown,
  options: ReadableOptions = {},
): Readable {
  if (BufferReadable.accept(input)) return new BufferReadable(input, options);
  if (IteratorReadable.accept(input))
    return new IteratorReadable(input, options);

  const context = `Creating readable stream.`;
  const problem = `Input is not a buffer or iterable data.`;
  const solution = `Please supply one of the following type as input: Array, ArrayBuffer, AsyncIterable, AsyncIterator, Iterable, Iterator, TypedArray or string`;
  throw new TypeError(`${context} ${problem} ${solution}`);
}
