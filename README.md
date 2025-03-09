![npm](https://img.shields.io/npm/v/scope-utilities)
![NPM](https://img.shields.io/npm/l/scope-utilities)
![GitHub issues](https://img.shields.io/github/issues/omranjamal/scope-utilities)
![npm bundle size](https://img.shields.io/bundlephobia/min/scope-utilities)
![npm](https://img.shields.io/npm/dw/scope-utilities)
![GitHub forks](https://img.shields.io/github/forks/omranjamal/scope-utilities)
![GitHub Repo stars](https://img.shields.io/github/stars/omranjamal/scope-utilities)

# scope-utilities

A quest to use the [JavaScript pipeline operator](https://github.com/tc39/proposal-pipeline-operator)'s mental model using inspiration from Kotlin's `let` and `also` [scope functions](https://kotlinlang.org/docs/scope-functions.html).

This library was original built to assist in writing conditional [Kysely](https://kysely.dev/) queries.

## Features

1. Chaining
2. Really Great Type Inference
3. Async-Await Support
4. Mixing `.let()` and `.also()`

## Installation

```bash
# pnpm
pnpm add --save scope-utilities

# npm
npm install --save scope-utilities
```

## Usage

```typescript
import { scope, run, returnOf } from "scope-utilities";
```

## Using `scope(VALUE).let(FUNC).value()`

The `.let()` function is useful for transforming the value. The let function takes in a function, `FUNC` that accepts the current scoped `VALUE` as input.

The return of the `.let()` function is the return of `FUNC` but wrapped in a `scope()` call itself. This allows chaining.

See the examples below for more details.

### Example - Simple Chaining

```ts
const result = scope(1)
  .let((x) => x + 1)
  .let((x) => x * 2)
  .let((x) => x - 1)
  .value();

console.log(result); // 3
```

### Example - Async-Await Support

Using a single async function in a chain will cause the entire `.value()` expression to be awaitable (promise).

Note: the subsequent `.let()` or `.also()` need not be async.

```ts
async function double(x: number) {
  return await Promise.resolve(x * 2);
}

const result = await scope(1)
  .let((x) => x + 1)
  .let(async (x) => await double(x))
  .let((x) => x - 1)
  .value();

console.log(result); // 3
```

### Example - Conditional Queries

```ts
const kyselyQuery = scope(kysely.selectFrom("media"))
  .let((query) =>
    input.shop_id ? query.where("shop_id", "=", input.shop_id) : query
  )
  .let((query) =>
    query
      .where("media.type", "=", input.type)
      .where("media.deleted_at", "is", null)
  )
  .value();

await kyselyQuery.execute();
```

## Using `scope(VALUE).also(FUNC).value()`

The `.also()` function is ideal for logging or debugging, as well as containing mutations to a mutable object to a single expression.

Think of it like a function that initializes a variable, makes modifications to the object contained within the variable and returns the original variable.

Similar to `.let`, `.also` takes in a function, `FUNC` that accepts the current scoped `VALUE` as input.

The return value of the `.also()` function is simply the current scoped value (NOT the return value of `FUNC`) but wrapped in a `scope()` call itself. This allows chaining.

See the examples below for more details.

## Example - Date Builder

Note: the order of operations is always maintained
irrespective of if you mix `.let()` or `.order()`

```ts
const sameTimeNextWeekEpoch = scope(new Date())
  .also((date) => {
    date.setDate(date.getDate() + 7);
  })
  .let((date) => date.getTime() / 1000)
  .value();
```

### Example - Async Date Builder

```ts
async function randomInt(x: number) {
  return await Promise.resolve(Math.round(Math.random() * 5));
}

const sameTimeAfterFewDays = await scope(new Date())
  .also(async (date) => {
    date.setDate(date.getDate() + (await randomInt()));
  })
  .let((date) => date.getTime() / 1000)
  .value();
```

## Mixing `.let()` and `.also()`

The `.also()` function is useful for logging or debugging.

```ts
const result = await scope(1)
  .let((x) => x + 1)
  .let(async (x) => await double(x))
  .also((x) => {
    console.log(x);
  })
  .let((x) => x - 1)
  .value();
```

## Using `run()`

This is a simple function that just wraps the return value of a function in a `scope()` call.

```ts
const result = run(() => {
  return 1 + 1;
}).value();

console.log(result); // 2
```

## Using `returnOf()`

This is an even simpler function that just returns the return value of a function call.

> I created this because I think [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
> are ugly.

```ts
const result = returnOf(() => {
  return 1 + 1;
});

console.log(result); // 2
```

## API

```ts
export interface IScoped<T> {
  let<RT>(
    func: (value: OptionallyUnwrapPromise<T>) => RT
  ): IScoped<
    T extends Promise<infer REAL_T> ? Promise<OptionallyUnwrapPromise<RT>> : RT
  >;

  also<RT extends void | Promise<void>>(
    func: (value: OptionallyUnwrapPromise<T>) => RT
  ): IScoped<
    T extends Promise<infer REAL_T>
      ? Promise<OptionallyUnwrapPromise<T>>
      : RT extends Promise<any>
      ? Promise<OptionallyUnwrapPromise<T>>
      : T
  >;

  value(): T;
}

export function scope<T>(value: T): IScoped<T>;
export function run<T>(func: () => T): IScoped<T>;
export function returnOf<T>(func: () => T): T;
```

## License

MIT
