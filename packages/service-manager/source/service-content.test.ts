import { Readable } from "@marubase-tools/stream";
import { expect } from "chai";
import { ServiceContent } from "./service-content.js";

describe("ServiceContent", function () {
  let content: ServiceContent;
  beforeEach(async function () {
    content = new ServiceContent();
  });

  describe("get body", function () {
    context("when there is readable body", function () {
      it("should return readable", async function () {
        content.setBody(Readable.from([]));
        expect(content.body).to.have.property("read");
      });
    });
    context("when there is buffer body", function () {
      it("should return readable", async function () {
        content.setBody(Buffer.from([]));
        expect(content.body).to.have.property("read");
      });
    });
    context("when there is data body", function () {
      it("should return readable", async function () {
        content.setBody({});
        expect(content.body).to.have.property("read");
      });
    });
    context("when there is no body", function () {
      it("should return readable", async function () {
        expect(content.body).to.have.property("read");
      });
    });
  });

  describe("get headers", function () {
    context("when there is headers", function () {
      it("should return headers", async function () {
        content.setHeader("Content-Type", "application/json");
        expect(content.headers).to.deep.equal({
          "Content-Type": "application/json",
        });
      });
    });
    context("when there is no headers", function () {
      it("should return empty headers", async function () {
        expect(content.headers).to.deep.equal({});
      });
    });
  });

  describe("#buffer()", function () {
    context("when there is readable body", function () {
      it("should return buffer", async function () {
        content.setBody(Readable.from([]));

        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is readable body (filled)", function () {
      it("should return buffer", async function () {
        content.setBody(Readable.from(Buffer.from("{}")));

        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is buffer body", function () {
      it("should return buffer", async function () {
        content.setBody(Buffer.from([]));

        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is buffer body (filled)", function () {
      it("should return buffer", async function () {
        content.setBody(Buffer.from("{}"));

        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is data body", function () {
      it("should return buffer", async function () {
        content.setBody({});

        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
    context("when there is no body", function () {
      it("should return buffer", async function () {
        const buffer = await content.buffer();
        expect(buffer).to.be.an.instanceOf(Buffer);
      });
    });
  });

  describe("#clearBody()", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        content.setBody(Readable.from([]));

        const self = content.clearBody();
        expect(self).to.equal(content);
      });
    });
    context("when there is no body", function () {
      it("should return self", async function () {
        const self = content.clearBody();
        expect(self).to.equal(content);
      });
    });
  });

  describe("#clearHeader(key)", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        content.setHeader("Content-Type", "application/json");

        const self = content.clearHeader("Content-Type");
        expect(self).to.equal(content);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = content.clearHeader("Content-Type");
        expect(self).to.equal(content);
      });
    });
  });

  describe("#clearHeaders()", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        content.setHeader("Content-Type", "application/json");

        const self = content.clearHeaders();
        expect(self).to.equal(content);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = content.clearHeaders();
        expect(self).to.equal(content);
      });
    });
  });

  describe("#json()", function () {
    context("when there is readable body", function () {
      it("should return json", async function () {
        content.setBody(Readable.from([]));

        const json = await content.json();
        expect(json).to.be.null;
      });
    });
    context("when there is readable body (filled)", function () {
      it("should return json", async function () {
        content.setBody(Readable.from(Buffer.from("{}")));

        const json = await content.json();
        expect(json).to.be.deep.equal({});
      });
    });
    context("when there is buffer body", function () {
      it("should return json", async function () {
        content.setBody(Buffer.from([]));

        const json = await content.json();
        expect(json).to.be.null;
      });
    });
    context("when there is buffer body (filled)", function () {
      it("should return json", async function () {
        content.setBody(Buffer.from("{}"));

        const json = await content.json();
        expect(json).to.be.deep.equal({});
      });
    });
    context("when there is json body", function () {
      it("should return json", async function () {
        content.setBody({});

        const json = await content.json();
        expect(json).to.deep.equal({});
      });
    });
    context("when there is no body", function () {
      it("should return json", async function () {
        const json = await content.json();
        expect(json).to.be.null;
      });
    });
  });

  describe("#setBody(body)", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        content.setBody(Readable.from([]));

        const self = content.setBody(Readable.from([]));
        expect(self).to.equal(content);
      });
    });
    context("when there is no body", function () {
      it("should return self", async function () {
        const self = content.setBody(Readable.from([]));
        expect(self).to.equal(content);
      });
    });
  });

  describe("#setHeader(key, value)", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        content.setHeader("Content-Type", "application/json");

        const self = content.setHeader("Content-Type", "text/plain");
        expect(self).to.equal(content);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = content.setHeader("Content-Type", "text/plain");
        expect(self).to.equal(content);
      });
    });
  });

  describe("#setHeaders()", function () {
    context("when there is headers", function () {
      it("should return self", async function () {
        content.setHeader("Content-Type", "application/json");

        const self = content.setHeaders({ "Content-Type": "text/plain" });
        expect(self).to.equal(content);
      });
    });
    context("when there is no headers", function () {
      it("should return self", async function () {
        const self = content.setHeaders({ "Content-Type": "text/plain" });
        expect(self).to.equal(content);
      });
    });
  });
});
