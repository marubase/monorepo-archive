import "readable-stream";

declare module "readable-stream" {
  export function finished(
    stream: Duplex | Readable | Writable,
    callback: Function,
  ): Function;
  export function finished(
    stream: Duplex | Readable | Writable,
    options: FinishedOptions,
    callback: Function,
  ): Function;

  export function pipeline(
    source: Readable,
    ...destinationOrCallback: Array<Duplex | Function>
  ): Readable;

  export type FinishedOptions = {
    error?: boolean;
    readable?: boolean;
    writable?: boolean;
  };
}
