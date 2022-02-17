/// <reference path="readable-stream.d.ts" />
import {
  Duplex,
  DuplexOptions,
  finished,
  finishedOptions,
  pipeline,
  ReadableOptions,
  Transform,
  TransformOptions,
  Writable,
  WritableOptions,
} from "readable-stream";
import { isReadable, Readable } from "./readable.js";

export {
  Duplex,
  DuplexOptions,
  Readable,
  ReadableOptions,
  Transform,
  TransformOptions,
  Writable,
  WritableOptions,
  finished,
  finishedOptions,
  isReadable,
  pipeline,
};
