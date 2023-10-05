import { assert } from "chai";
import { returnOf, run, scope } from "../src/index.mjs";

describe("scope(object)", () => {
  describe(".let", () => {
    it("should return the return value of the operator function", () => {
      assert.equal(
        scope(null).let(() => {
          return "tomato";
        }),
        "tomato",
      );
    });

    it("should be passed in the scoped object as `it` (first argument)", () => {
      let passedIt: string | null = null;

      scope("tomato").let((it) => {
        passedIt = it;
      });

      assert.equal(passedIt, "tomato");
    });
  });

  describe(".with", () => {
    it("should return the return value of the operator function", () => {
      assert.equal(
        scope(null).with(() => {
          return "tomato";
        }),
        "tomato",
      );
    });

    it("should be passed in the scoped object as `this` (context variable)", () => {
      let passedIt: string | null = null;

      scope("tomato").with(function () {
        passedIt = this;
      });

      assert.equal(passedIt, "tomato");
    });
  });

  describe(".run", () => {
    it("should return the return value of the operator function", () => {
      assert.equal(
        scope(null).run(() => {
          return "tomato";
        }),
        "tomato",
      );
    });

    it("should be passed in the scoped object as `this` (context variable)", () => {
      let passedIt: string | null = null;

      scope("tomato").run(function () {
        passedIt = this;
      });

      assert.equal(passedIt, "tomato");
    });
  });

  describe(".apply", () => {
    it("should return the scoped variable itself", () => {
      assert.equal(
        scope("potato").apply(() => {
          return "tomato";
        }),
        "potato",
      );
    });

    it("should be passed in the scoped object as `this` (context variable)", () => {
      let passedIt: string | null = null;

      scope("tomato").apply(function () {
        passedIt = this;
      });

      assert.equal(passedIt, "tomato");
    });

    it("should be awaitable && promise should resolve to scoped variable itself", async () => {
      assert.equal(
        await scope("tomato").apply(async function () {
          return 42;
        }),
        "tomato",
      );
    });

    it("should be awaitable && should be passed in the scoped object as `this` (context variable)", async () => {
      let passedIt: string | null = null;

      await scope("tomato").apply(async function () {
        await new Promise((accept) => setTimeout(accept, 50));
        passedIt = this;
      });

      assert.equal(passedIt, "tomato");
    });
  });

  describe(".also", () => {
    it("should return the scoped variable itself", () => {
      assert.equal(
        scope("potato").also(() => {
          return "tomato";
        }),
        "potato",
      );
    });

    it("should be passed in the scoped object as `it` (first argument)", () => {
      let passedIt: string | null = null;

      scope("tomato").also((it) => {
        passedIt = it;
      });

      assert.equal(passedIt, "tomato");
    });

    it("should be awaitable && promise should resolve to scoped variable itself", async () => {
      assert.equal(
        await scope("tomato").also(async function () {
          return 42;
        }),
        "tomato",
      );
    });

    it("should be awaitable && should be passed in the scoped object as `it` (first argument)", async () => {
      let passedIt: string | null = null;

      await scope("tomato").also(async (it) => {
        await new Promise((accept) => setTimeout(accept, 50));
        passedIt = it;
      });

      assert.equal(passedIt, "tomato");
    });
  });

  describe(".takeIf", () => {
    it("should return null if the operator function returns false", () => {
      assert.isNull(
        scope("potato").takeIf(() => {
          return false;
        }),
      );
    });

    it("should return scoped object if the operator function returns true", () => {
      assert.equal(
        scope("potato").takeIf(() => {
          return true;
        }),
        "potato",
      );
    });

    it("should be passed in the scoped object as `it` (first argument)", () => {
      let passedIt: string | null = null;

      scope("tomato").takeIf((it) => {
        passedIt = it;

        return false;
      });

      assert.equal(passedIt, "tomato");
    });

    it("should be awaitable && should resolve null if the operator function returns false", async () => {
      assert.isNull(
        await scope("potato").takeIf(async () => {
          return false;
        }),
      );
    });

    it("should be awaitable && should resolve scoped object if the operator function returns true", async () => {
      assert.equal(
        await scope("potato").takeIf(async () => {
          return true;
        }),
        "potato",
      );
    });
  });

  describe(".takeUnless", () => {
    it("should return null if the operator function returns true", () => {
      assert.isNull(
        scope("potato").takeUnless(() => {
          return true;
        }),
      );
    });

    it("should return scoped object if the operator function returns false", () => {
      assert.equal(
        scope("potato").takeUnless(() => {
          return false;
        }),
        "potato",
      );
    });

    it("should be passed in the scoped object as `it` (first argument)", () => {
      let passedIt: string | null = null;

      scope("tomato").takeUnless((it) => {
        passedIt = it;

        return false;
      });

      assert.equal(passedIt, "tomato");
    });

    it("should be awaitable && should resolve scoped object if the operator function returns false", async () => {
      assert.equal(
        await scope("potato").takeUnless(async () => {
          return false;
        }),
        "potato",
      );
    });

    it("should be awaitable && should resolve null if the operator function returns true", async () => {
      assert.isNull(
        await scope("potato").takeUnless(async () => {
          return true;
        }),
      );
    });
  });

  describe("ALIASES", () => {
    it("let === letFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.let, scoped.letFunc);
    });

    it("with === withFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.with, scoped.withFunc);
    });

    it("run === runFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.run, scoped.runFunc);
    });

    it("apply === applyFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.apply, scoped.applyFunc);
    });

    it("also === alsoFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.also, scoped.alsoFunc);
    });

    it("takeIf === takeIfFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.takeIf, scoped.takeIfFunc);
    });

    it("takeUnless === takeUnlessFunc", () => {
      const scoped = scope(null);
      assert.strictEqual(scoped.takeUnless, scoped.takeUnlessFunc);
    });
  });
});

describe("run(func)", () => {
  it("should return the return value of the operator function", () => {
    assert.strictEqual(
      run(() => {
        return "potato";
      }),
      "potato",
    );
  });
});

describe("returnOf(func)", () => {
  it("should return the return value of the operator function", () => {
    assert.strictEqual(
      returnOf(() => {
        return "potato";
      }),
      "potato",
    );
  });
});
