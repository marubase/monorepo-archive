import { expect } from "chai";
import { ServiceMessage } from "./service-message.js";

describe("ServiceMessage", function () {
  let message: ServiceMessage;
  beforeEach(async function () {
    message = new ServiceMessage();
  });

  describe("get body", function () {
    context("when there is body", function () {
      it("should return body", async function () {
        message.setBody(true);
        expect(message.body).to.be.true;
      });
    });
    context("when there is no body", function () {
      it("should return undefined", async function () {
        expect(message.body).to.be.undefined;
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

  describe("#clearBody()", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        message.setBody(true);

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

  describe("#setBody(body)", function () {
    context("when there is body", function () {
      it("should return self", async function () {
        message.setBody(false);

        const self = message.setBody(true);
        expect(self).to.equal(message);
      });
    });
    context("when there is no body", function () {
      it("should return self", async function () {
        const self = message.setBody(true);
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
