export function scope<TYPE>(object: TYPE) {
  function letFunc<RETURN_TYPE>(
    func: (object: TYPE) => RETURN_TYPE
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

  function applyFunc(func: { (this: TYPE): void }): TYPE {
    (func.bind(object) as any)();
    return object;
  }

  function alsoFunc(func: (object: TYPE) => void): TYPE {
    func(object);
    return object;
  }

  function takeIfFunc(func: (object: TYPE) => boolean): TYPE | null {
    return func(object) ? object : null;
  }

  function takeUnlessFunc(func: (object: TYPE) => boolean): TYPE | null {
    return func(object) ? null : object;
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
