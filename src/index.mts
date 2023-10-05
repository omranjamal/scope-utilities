export function scope<TYPE>(object: TYPE) {
  function letFunc<RETURN_TYPE>(
    func: (object: TYPE) => RETURN_TYPE,
  ): RETURN_TYPE {
    return func(object);
  }

  function withFunc<RETURN_TYPE>(func: {
    (this: TYPE): RETURN_TYPE;
  }): RETURN_TYPE {
    const boundFunction = func.bind(object);
    return (boundFunction as any)();
  }

  function runFunc<RETURN_TYPE>(func: {
    (this: TYPE): RETURN_TYPE;
  }): RETURN_TYPE {
    const boundFunction = func.bind(object);
    return (boundFunction as any)();
  }

  function applyFunc(func: { (this: TYPE): Promise<void> }): Promise<TYPE>;

  function applyFunc(func: { (this: TYPE): void }): TYPE;

  function applyFunc(func: {
    (this: TYPE): Promise<void> | void;
  }): Promise<TYPE> | TYPE {
    const result = (func.bind(object) as any)();

    if (result instanceof Promise) {
      return new Promise((accept, reject) => {
        result
          .then(() => {
            accept(object);
          })
          .catch(reject);
      });
    } else {
      return object;
    }
  }

  function alsoFunc(func: (object: TYPE) => Promise<void>): Promise<TYPE>;

  function alsoFunc(func: (object: TYPE) => void): TYPE;

  function alsoFunc(
    func: (object: TYPE) => Promise<void> | void,
  ): Promise<TYPE> | TYPE {
    const result = func(object);

    if (result instanceof Promise) {
      return new Promise((accept, reject) => {
        result
          .then(() => {
            accept(object);
          })
          .catch(reject);
      });
    } else {
      return object;
    }
  }

  function takeIfFunc(func: (object: TYPE) => boolean): TYPE | null;

  function takeIfFunc(
    func: (object: TYPE) => Promise<boolean>,
  ): Promise<TYPE | null>;

  function takeIfFunc(
    func: (object: TYPE) => Promise<boolean> | boolean,
  ): Promise<TYPE | null> | TYPE | null {
    const result = func(object);

    if (result instanceof Promise) {
      return new Promise((accept, reject) => {
        result
          .then((pass) => {
            if (pass) {
              accept(object);
            } else {
              accept(null);
            }
          })
          .catch(reject);
      });
    } else {
      return result ? object : null;
    }
  }

  function takeUnlessFunc(func: (object: TYPE) => boolean): TYPE | null;

  function takeUnlessFunc(
    func: (object: TYPE) => Promise<boolean>,
  ): Promise<TYPE | null>;

  function takeUnlessFunc(
    func: (object: TYPE) => Promise<boolean> | boolean,
  ): Promise<TYPE | null> | TYPE | null {
    const result = func(object);

    if (result instanceof Promise) {
      return new Promise((accept, reject) => {
        result
          .then((pass) => {
            if (pass) {
              accept(null);
            } else {
              accept(object);
            }
          })
          .catch(reject);
      });
    } else {
      return result ? null : object;
    }
  }

  return {
    let: letFunc,
    letFunc: letFunc,

    with: withFunc,
    withFunc: withFunc,

    run: runFunc,
    runFunc: runFunc,

    apply: applyFunc,
    applyFunc: applyFunc,

    also: alsoFunc,
    alsoFunc: alsoFunc,

    takeIf: takeIfFunc,
    takeIfFunc: takeIfFunc,

    takeUnless: takeUnlessFunc,
    takeUnlessFunc: takeUnlessFunc,
  };
}

export function run<T>(func: () => T): T {
  return func();
}

export function returnOf<T>(func: () => T): T {
  return func();
}
