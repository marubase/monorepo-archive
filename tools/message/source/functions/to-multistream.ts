import { toReadable } from "@marubase-tools/stream";
import { Readable } from "stream";

export async function* toMultiStream(
  boundary: string,
  stream: Readable,
): AsyncIterableIterator<Readable> {
  const reader = stream[Symbol.asyncIterator]();
  const starter = `\r\n--${boundary}\r\n`;
  const ender = `\r\n--${boundary}--`;

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const starterIndex = buffer.indexOf(starter);
    const enderIndex = buffer.indexOf(ender);
    if (starterIndex >= 0 && enderIndex >= 0) {
      if (starterIndex > enderIndex) return;
      else break;
    } else if (starterIndex < 0 && enderIndex < 0) {
      continue;
    } else if (enderIndex >= 0) {
      return;
    } else if (starterIndex >= 0) {
      break;
    }
  }

  do {
    const starterIndex = buffer.indexOf(starter);
    const enderIndex = buffer.indexOf(ender);
    if (starterIndex >= 0 && enderIndex >= 0) {
      if (starterIndex > enderIndex) break;

      const part = buffer.subarray(starterIndex + starter.length, enderIndex);
      const partIndex = part.indexOf(starter);
      if (partIndex >= 0) {
        const chunk = part.subarray(0, partIndex);
        const readable = toReadable(chunk);
        buffer = buffer.subarray(starterIndex + starter.length + partIndex);
        yield readable;
      } else {
        const readable = toReadable(part);
        buffer = Buffer.from([]);
        yield readable;
      }
    } else if (starterIndex < 0 && enderIndex < 0) {
      break;
    } else if (enderIndex >= 0) {
      break;
    } else if (starterIndex >= 0) {
      const part = buffer.subarray(starterIndex + starter.length);
      const partIndex = part.indexOf(starter);
      if (partIndex >= 0) {
        const chunk = part.subarray(0, partIndex);
        const readable = toReadable(chunk);
        buffer = buffer.subarray(starterIndex + starter.length + partIndex);
        yield readable;
      } else {
        let nextPart: (error?: Error) => void;
        const partComplete = new Promise((resolve, reject) => {
          nextPart = (error?: Error): void =>
            typeof error !== "undefined" ? reject(error) : resolve(undefined);
        });

        const readable = new Readable({
          read() {
            reader.next().then(
              (chunk) => {
                if (chunk.done) {
                  const context = `Reading multipart body.`;
                  const problem = `Readable stream ended unexpectedly.`;
                  const solution = `Please try again.`;
                  const error = new Error(`${context} ${problem} ${solution}`);
                  this.destroy(error);
                  nextPart(error);
                } else {
                  buffer = Buffer.concat([buffer, chunk.value]);

                  const starterIndex = buffer.indexOf(starter);
                  const enderIndex = buffer.indexOf(ender);
                  if (starterIndex >= 0 && enderIndex >= 0) {
                    if (starterIndex > enderIndex) {
                      const chunk = buffer.subarray(0, enderIndex);
                      this.push(chunk), this.push(null);
                      buffer = Buffer.from([]);
                      nextPart();
                    } else {
                      const chunk = buffer.subarray(0, starterIndex);
                      this.push(chunk), this.push(null);
                      buffer = buffer.subarray(starterIndex);
                      nextPart();
                    }
                  } else if (starterIndex < 0 && enderIndex < 0) {
                    this.push(buffer);
                    buffer = Buffer.from([]);
                  } else if (enderIndex >= 0) {
                    const chunk = buffer.subarray(0, enderIndex);
                    this.push(chunk), this.push(null);
                    buffer = Buffer.from([]);
                    nextPart();
                  } else if (starterIndex >= 0) {
                    const chunk = buffer.subarray(0, starterIndex);
                    this.push(chunk), this.push(null);
                    buffer = buffer.subarray(0, starterIndex);
                    nextPart();
                  }
                }
              },
              (error) => this.destroy(error),
            );
          },
        });
        readable.push(part);
        buffer = Buffer.from([]);
        yield readable;
        await partComplete;
      }
    }
  } while (buffer.length > 0);
}
