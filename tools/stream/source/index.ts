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
import { IterableReadable } from "./iterable-readable.js";

declare module "readable-stream" {
  namespace Readable {
    function create(
      iterable: IterableInput,
      options?: ReadableOptions,
    ): Readable;
  }

  export function finished(
    stream: Duplex | Readable | Transform | Writable,
    callback: Function,
  ): Function;
  export function finished(
    stream: Duplex | Readable | Transform | Writable,
    options: { error?: boolean; readable?: boolean; writable?: boolean },
    callback: Function,
  ): Function;

  export function isDuplexStream(readable: unknown): boolean;

  export function isReadableStream(readable: unknown): boolean;

  export function isWritableStream(writable: unknown): boolean;

  export function pipeline(
    source: Readable,
    ...streamOrCallback: Array<Duplex | Writable | ((error: Error) => void)>
  ): Stream;
  export function pipeline(
    streams: Array<Duplex | Readable | Writable>,
    callback: (error: Error) => void,
  ): Stream;

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

export * from "./functions/index.js";
export {
  Duplex,
  DuplexOptions,
  Readable,
  ReadableOptions,
  finished,
  PassThrough,
  pipeline,
  Transform,
  TransformOptions,
  Writable,
  WritableOptions,
};
export default stream;
