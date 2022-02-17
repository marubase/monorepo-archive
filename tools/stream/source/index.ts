/* eslint-disable @typescript-eslint/no-namespace */
import stream, {
  Duplex,
  DuplexOptions,
  finished,
  PassThrough,
  pipeline,
  Readable,
  ReadableOptions,
  Transform,
  TransformOptions,
  Writable,
  WritableOptions,
} from "readable-stream";
import {
  isDuplexStream,
  isReadableStream,
  isWritableStream,
} from "./functions/index.js";
import { IterableReadable } from "./iterable-readable.js";

declare module "readable-stream" {
  namespace Readable {
    function create(
      iterable: IterableInput,
      options?: stream.ReadableOptions,
    ): stream.Readable;
  }

  export function finished(
    stream:
      | stream.Duplex
      | stream.Readable
      | stream.Transform
      | stream.Writable,
    callback: (error?: Error) => void,
  ): Function;
  export function finished(
    stream:
      | stream.Duplex
      | stream.Readable
      | stream.Transform
      | stream.Writable,
    options: { error?: boolean; readable?: boolean; writable?: boolean },
    callback: (error?: Error) => void,
  ): Function;

  export function isDuplexStream(readable: unknown): boolean;

  export function isReadableStream(readable: unknown): boolean;

  export function isWritableStream(writable: unknown): boolean;

  export function pipeline(
    source: stream.Readable,
    ...streamOrCallback: Array<
      stream.Duplex | stream.Writable | ((error?: Error) => void)
    >
  ): stream.Readable;
  export function pipeline(
    streams: Array<stream.Duplex | stream.Readable | stream.Writable>,
    callback: (error?: Error) => void,
  ): stream.Readable;

  export type IterableInput =
    | Array<unknown>
    | ArrayBuffer
    | AsyncIterable<unknown>
    | AsyncIterator<unknown>
    | Buffer
    | Iterable<unknown>
    | Iterator<unknown>
    | NodeJS.TypedArray
    | string;
}

Readable.create = (
  iterable: stream.IterableInput,
  options: stream.ReadableOptions = {},
): stream.Readable => new IterableReadable(iterable, options);

stream.isDuplexStream = isDuplexStream;

stream.isReadableStream = isReadableStream;

stream.isWritableStream = isWritableStream;

export * from "./functions/index.js";
export {
  Duplex,
  DuplexOptions,
  Readable,
  ReadableOptions,
  finished,
  isDuplexStream,
  isReadableStream,
  isWritableStream,
  PassThrough,
  pipeline,
  Transform,
  TransformOptions,
  Writable,
  WritableOptions,
};
export default stream;
