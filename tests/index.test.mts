import { assert } from "chai";
import { scope } from "../src/index.mjs";

describe("scope(object)", () => {
  describe(".let", () => {
    it("should return the return value of the operator function", () => {
      assert.equal(
        scope(null).let(() => {
          return "tomato";
        }),
        "tomato"
      );
    });

    it("should be passed in the scoped object", () => {
      let passedIt: string | null = null;

      scope("tomato").let((it) => {
        passedIt = it;
      });

      assert.equal(passedIt, "tomato");
    });
  });
});
