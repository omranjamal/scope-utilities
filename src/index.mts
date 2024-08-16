export type OptionallyUnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export interface IScoped<T> {
  let<RT>(
    func: (value: OptionallyUnwrapPromise<T>) => RT,
  ): IScoped<
    T extends Promise<infer REAL_T> ? Promise<OptionallyUnwrapPromise<RT>> : RT
  >;

  also(
    func: (value: OptionallyUnwrapPromise<T>) => void,
  ): IScoped<
    T extends Promise<infer REAL_T> ? Promise<OptionallyUnwrapPromise<T>> : T
  >;

  value(): T;
}

export function scope<TYPE>(value: TYPE): IScoped<TYPE> {
  function letFunc(func: (value: any) => any) {
    if (value instanceof Promise) {
      return scope(
        new Promise((accept, reject) => {
          value
            .then((awaitedValue) => {
              accept(func(awaitedValue));
            })
            .catch(reject);
        }),
      );
    } else {
      return scope(func(value as any));
    }
  }

  function alsoFunc(func: (value: any) => void) {
    if (value instanceof Promise) {
      return scope(
        new Promise((accept, reject) => {
          value
            .then((awaitedValue) => {
              func(awaitedValue);
              accept(value);
            })
            .catch(reject);
        }),
      );
    } else {
      return scope(value);
    }
  }

  return {
    let: letFunc as any,
    also: alsoFunc as any,

    value() {
      return value;
    },
  };
}

export function run<T>(func: () => T): ReturnType<typeof scope<T>> {
  return scope(func());
}

export function returnOf<T>(func: () => T): T {
  return func();
}
