import "readable-stream";

declare module "readable-stream" {
  export function finished(
    stream: Duplex | Readable | Writable,
    callback: Function,
  ): Function;
  export function finished(
    stream: Duplex | Readable | Writable,
    options: finishedOptions,
    callback: Function,
  ): Function;

  export function pipeline(
    source: Readable,
    ...destinationOrCallback: Array<Duplex | Function>
  ): Readable;

  export type finishedOptions = {
    error?: boolean;
    readable?: boolean;
    writable?: boolean;
  };
}
