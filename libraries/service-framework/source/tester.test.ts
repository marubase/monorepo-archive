import { expect } from "chai";
import { Tester } from "./tester.js";

describe("Tester", function () {
  describe("#test()", function () {
    it("should return true", async function () {
      const tester = new Tester();
      expect(tester.test()).to.be.true;
    });
  });
});
