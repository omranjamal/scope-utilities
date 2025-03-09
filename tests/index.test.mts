import { assert } from "chai";
import { returnOf, run, scope } from "../src/index.mjs";

describe("run(func)", () => {
  it("should return the return value of the function within a scope", async () => {
    assert.equal(run(() => 1).value(), 1);
    assert.equal(await run(async () => await Promise.resolve(2)).value(), 2);
  });
});

describe("returnOf(func)", () => {
  it("should return the return value of a function", async () => {
    assert.equal(
      returnOf(() => 1),
      1
    );
    assert.equal(await returnOf(async () => await Promise.resolve(2)), 2);
  });
});

describe("scope(value)", () => {
  describe(".let", () => {
    it("should return the value of the last operator function scoped", async () => {
      assert.equal(scope(1).value(), 1);

      assert.equal(
        scope(1)
          .let((v) => v + 1)
          .value(),
        2
      );

      assert.equal(
        await scope(1)
          .let((v) => v + 1)
          .let(async (v) => v + 1)
          .let((v) => v + 1)
          .value(),
        4
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
        7
      );
    });
  });

  describe(".also", () => {
    it("should return the object itself", () => {
      assert.equal(
        scope(1)
          .also(() => {
            // return true;
          })
          .value(),
        1
      );
    });

    it("should be passed in the value from the preceding .let", () => {
      let value = 0;

      scope(1)
        .let(() => 2)
        .also((v) => {
          value = v;
        })
        .value();

      assert.equal(value, 2);
    });

    it("should return the value returned from the preceding .let", () => {
      assert.equal(
        scope(1)
          .let(() => 2)
          .also(() => {
            // return true;
          })
          .value(),
        2
      );
    });

    it(".also should also be chainable", async () => {
      assert.equal(
        await scope(1)
          .let(() => 2)
          .also((v) => {
            assert.equal(v, 2);
          })
          .also(async (v) => {
            assert.equal(v, 2);
          })
          .let(() => 9)
          .also((v) => {
            assert.equal(v, 9);
          })
          .value(),
        9
      );
    });
  });

  describe("mixing .let and .also", () => {
    it("it should maintain the order of operations", async () => {
      let counter = 0;

      assert.equal(
        await scope(1)
          .let((v) => {
            assert.equal(counter++, 0);
            return 2;
          })
          .also(async (v) => {
            assert.equal(counter++, 1);
          })
          .let((v) => {
            assert.equal(counter++, 2);
            return 4;
          })
          .also((v) => {
            assert.equal(counter++, 3);
          })
          .let(async (v) => {
            assert.equal(counter++, 4);
            return 9;
          })
          .value(),
        9
      );
    });
  });

  describe(".value", () => {
    it("should return promise if any return type in the chain is a promise", () => {
      assert.instanceOf(scope(Promise.resolve(1)).value(), Promise);

      assert.instanceOf(
        scope(1)
          .let(async (v) => v)
          .value() satisfies Promise<any>,
        Promise
      );

      assert.instanceOf(
        scope(1)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .let((v) => v)
          .value() satisfies Promise<any>,
        Promise
      );

      assert.instanceOf(
        scope(1)
          .let((v) => v)
          .also(async (v) => {
            v;
          })
          .let((v) => v)
          .let((v) => v)
          .value() satisfies Promise<any>,
        Promise
      );

      assert.instanceOf(
        scope(1)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .let((v) => v)
          .let(async (v) => v)
          .let((v) => v)
          .value() satisfies Promise<any>,
        Promise
      );
    });

    it("should NOT result promise if no return type in the chain is a promise", () => {
      assert.notInstanceOf(scope(1).value(), Promise);

      assert.notInstanceOf(
        scope(1)
          .let((v) => v)
          .value(),
        Promise
      );

      assert.notInstanceOf(
        scope(1)
          .let((v) => v)
          .let((v) => v)
          .let((v) => v)
          .value(),
        Promise
      );
    });
  });
});
