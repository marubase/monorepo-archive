import { expect } from "chai";
import { Tester } from "./tester.js";

suite("Tester", function () {
  let tester: Tester;
  setup(async function () {
    tester = new Tester();
  });

  suite("#test()", function () {
    test("should return true", async function () {
      const expectedReturn = true;
      const actualReturn = tester.test();
      expect(actualReturn).to.equal(expectedReturn);
    });
  });
});
