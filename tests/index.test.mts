import { assert } from "chai";
import { returnOf, run, scope } from "../src/index.mjs";

describe("scope(value)", () => {
  describe(".let", () => {
    it("should return the value of the last operator function scoped", async () => {
      assert.equal(scope(1).value(), 1);

      assert.equal(
        scope(1)
          .let((v) => v + 1)
          .value(),
        2,
      );

      assert.equal(
        await scope(1)
          .let((v) => v + 1)
          .let(async (v) => v + 1)
          .let((v) => v + 1)
          .value(),
        4,
      );

      assert.equal(
        await scope(1)
          .let((v) => v + 1)
          .let(async (v) => v + 1)
          .let((v) => v + 1)
          .let((v) => v + 1)
          .let(async (v) => v + 1)
          .let((v) => v + 1)
          .value(),
        7,
      );
    });
  });

  describe(".value", () => {
    it("should return promise if any return type in the chain is a promise", () => {
      assert.instanceOf(scope(Promise.resolve(1)).value(), Promise);

      assert.instanceOf(
        scope(1)
          .let(async (v) => v)
          .value(),
        Promise,
      );

      assert.instanceOf(
        scope(1)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .let((v) => v)
          .value(),
        Promise,
      );

      assert.instanceOf(
        scope(1)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .value(),
        Promise,
      );
    });

    it("should NOT result promise if no return type in the chain is a promise", () => {
      assert.notInstanceOf(scope(1).value(), Promise);

      assert.notInstanceOf(
        scope(1)
          .let((v) => v)
          .value(),
        Promise,
      );

      assert.notInstanceOf(
        scope(1)
          .let((v) => v)
          .let((v) => v)
          .let((v) => v)
          .value(),
        Promise,
      );
    });
  });
});
