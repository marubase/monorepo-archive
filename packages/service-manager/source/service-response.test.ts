import { expect } from "chai";
import { ServiceResponse } from "./service-response.js";

describe("ServiceResponse", function () {
  let response: ServiceResponse;
  beforeEach(async function () {
    response = new ServiceResponse();
  });

  describe("get statusCode", function () {
    it("should return status code", async function () {
      expect(response.statusCode).to.equal(200);
    });
  });

  describe("get statusText", function () {
    it("should return status text", async function () {
      expect(response.statusText).to.equal("OK");
    });
  });

  describe("#setStatusCode(statusCode)", function () {
    it("should return self", async function () {
      const self = response.setStatusCode(200);
      expect(self).to.equal(response);
    });
  });

  describe("#setStatusText(statusText)", function () {
    it("should return self", async function () {
      const self = response.setStatusText("CustomText");
      expect(self).to.equal(self);
    });
  });
});
