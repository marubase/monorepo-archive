/// <reference path="readable-stream.d.ts" />
import {
  Duplex,
  finished,
  pipeline,
  Transform,
  Writable,
} from "readable-stream";
import { isReadable, Readable } from "./readable.js";

export {
  Duplex,
  Readable,
  Transform,
  Writable,
  finished,
  isReadable,
  pipeline,
};
