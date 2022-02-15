import { Readable } from "@marubase-tools/stream";
import { expect } from "chai";
import { ServiceMessage } from "./service-message.js";

describe("ServiceMessage", function () {
  let message: ServiceMessage;
  beforeEach(async function () {
    message = new ServiceMessage();
  });

  describe("get body", function () {
    context("when there is readable body", function () {
      it("should return readable", async function () {
        message.setBody(Readable.from([]));
        expect(message.body).to.have.property("read");
      });
    });
    context("when there is buffer body", function () {
      it("should return readable", async function () {
        message.setBody(Buffer.from([]));
        expect(message.body).to.have.property("read");
      });
    });
    context("when there is data body", function () {
      it("should return readable", async function () {
        message.setBody({});
        expect(message.body).to.have.property("read");
      });
    });
    context("when there is no body", function () {
      it("should return readable", async function () {
        expect(message.body).to.have.property("read");
      });
    });
  });

  describe("get headers", function () {
    context("when there is headers", function () {
      it("should return headers", async function () {
        message.setHeader("Content-Type", "application/json");
        expect(message.headers).to.deep.equal({
          "Content-Type": "application/json",
        });
      });
    });
    context("when there is no headers", function () {
      it("should return empty headers", async function () {
        expect(message.headers).to.deep.equal({});
      });
    });
  });

  describe("#buffer()", function () {
    context("when there is readable body", function () {
      it("should return buffer", async function () {
        message.setBody(Readable.from([]));

        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is readable body (filled)", function () {
      it("should return buffer", async function () {
        message.setBody(Readable.from(Buffer.from("{}")));

        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is buffer body", function () {
      it("should return buffer", async function () {
        message.setBody(Buffer.from([]));

        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is buffer body (filled)", function () {
      it("should return buffer", async function () {
        message.setBody(Buffer.from("{}"));

        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is data body", function () {
      it("should return buffer", async function () {
        message.setBody({});

        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is no body", function () {
      it("should return buffer", async function () {
        const buffer = await message.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
  });

  describe("#clearBody()", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        message.setBody(Readable.from([]));

        const self = message.clearBody();
        expect(self).to.equal(message);
      });
    });
    context("when there is no body", function () {
      it("should return self", async function () {
        const self = message.clearBody();
        expect(self).to.equal(message);
      });
    });
  });

  describe("#clearHeader(key)", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        message.setHeader("Content-Type", "application/json");

        const self = message.clearHeader("Content-Type");
        expect(self).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = message.clearHeader("Content-Type");
        expect(self).to.equal(message);
      });
    });
  });

  describe("#clearHeaders()", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        message.setHeader("Content-Type", "application/json");

        const self = message.clearHeaders();
        expect(self).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = message.clearHeaders();
        expect(self).to.equal(message);
      });
    });
  });

  describe("#json()", function () {
    context("when there is readable body", function () {
      it("should return json", async function () {
        message.setBody(Readable.from([]));

        const json = await message.json();
        expect(json).to.be.null;
      });
    });
    context("when there is readable body (filled)", function () {
      it("should return json", async function () {
        message.setBody(Readable.from(Buffer.from("{}")));

        const json = await message.json();
        expect(json).to.be.deep.equal({});
      });
    });
    context("when there is buffer body", function () {
      it("should return json", async function () {
        message.setBody(Buffer.from([]));

        const json = await message.json();
        expect(json).to.be.null;
      });
    });
    context("when there is buffer body (filled)", function () {
      it("should return json", async function () {
        message.setBody(Buffer.from("{}"));

        const json = await message.json();
        expect(json).to.be.deep.equal({});
      });
    });
    context("when there is json body", function () {
      it("should return json", async function () {
        message.setBody({});

        const json = await message.json();
        expect(json).to.deep.equal({});
      });
    });
    context("when there is no body", function () {
      it("should return json", async function () {
        const json = await message.json();
        expect(json).to.be.null;
      });
    });
  });

  describe("#setBody(body)", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        message.setBody(Readable.from([]));

        const self = message.setBody(Readable.from([]));
        expect(self).to.equal(message);
      });
    });
    context("when there is no body", function () {
      it("should return self", async function () {
        const self = message.setBody(Readable.from([]));
        expect(self).to.equal(message);
      });
    });
  });

  describe("#setHeader(key, value)", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        message.setHeader("Content-Type", "application/json");

        const self = message.setHeader("Content-Type", "text/plain");
        expect(self).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = message.setHeader("Content-Type", "text/plain");
        expect(self).to.equal(message);
      });
    });
  });

  describe("#setHeaders()", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        message.setHeader("Content-Type", "application/json");

        const self = message.setHeaders({ "Content-Type": "text/plain" });
        expect(self).to.equal(message);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = message.setHeaders({ "Content-Type": "text/plain" });
        expect(self).to.equal(message);
      });
    });
  });
});
