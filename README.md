![npm](https://img.shields.io/npm/v/scope-utilities)
![NPM](https://img.shields.io/npm/l/scope-utilities)
![GitHub issues](https://img.shields.io/github/issues/omranjamal/scope-utilities)
![npm bundle size](https://img.shields.io/bundlephobia/min/scope-utilities)
![npm](https://img.shields.io/npm/dw/scope-utilities)
![GitHub forks](https://img.shields.io/github/forks/omranjamal/scope-utilities)
![GitHub Repo stars](https://img.shields.io/github/stars/omranjamal/scope-utilities)


# scope-utilities

> Bringing Kotlin's scope functions to JavaScript / TypeScript (and maybe adding a few more nice-to-haves).

## Features

- Kotlin's scope functions adapted for JavaScript / TypeScript
    - `.let()`
    - `.with()`
    - `.run()`
    - `.apply()`
    - `.also()`
    - `.takeIf()`
    - `.takeUnless()`
- Async / Await Support
- Unscoped `run()`
- Unscoped `run()` aliased to `returnOf()`

## Installation

```bash
# pnpm
pnpm add --save scope-utilities

# npm
npm install --save scope-utilities
```

## Usage

```typescript
import { scope } from 'scope-utilities';
```

### `.let()`

- Returns the result of the function you pass in.
- First argument of the function is the object you pass in `scope()`

```typescript
const sameTimeTomorrow: string = scope(new Date()).let((it: Date) => {
    it.setDate(it.getDate() + 1);
    return it.toISOString();
});
```

### `.with()`

- Returns the result of the function you pass in.
- `this` inside of the function is the object you pass in `scope()`

```typescript
const sameTimeTomorrow: string = scope(new Date()).let(function () {
    this.setDate(this.getDate() + 1);
    return this.toISOString();
});
```

**Note**: Does not work with arrow functions `() => {}` as the 
context is being re-bound.

### `.run()`

Exactly the same as `.with()` as JavaScript / TypeScript does
not have the concept of extension functions.

### `.apply()`

- Returns the object you pass in `scope()`
- `this` inside of the function is the object you pass in `scope()`

```typescript
const sameTimeTomorrow: Date = scope(new Date()).apply(() => {
    this.setDate(this.getDate() + 1);
});
```

### `.also()`

- Returns the object you pass in `scope()`
- First argument of the function is the object you pass in `scope()`

```typescript
const sameTimeTomorrow: Date = scope(new Date()).also((it: Date) => {
    it.setDate(it.getDate() + 1);
});
```

### `.takeIf()`

- Returns the object you pass in `scope()` if the function you pass in returns `true`
- Returns null if the function you pass in returns `false`
- First argument of the function is the object you pass in `scope()`

```typescript
const red: string | null = scope("red").takeIf((it: string) => {
    return it === "red";
});

red === "red"; // true



const blue: string | null = scope("blue").takeIf((it: string) => {
  return it === "red";
});

blue === null; // true
```

### `.takeUnless()`

- Returns the object you pass in `scope()` if the function you pass in returns `false`
- Returns null if the function you pass in returns `true`
- First argument of the function is the object you pass in `scope()`

```typescript
const red: string | null = scope("red").takeUnless((it: string) => {
    return it === "red";
});

red === null; // true



const blue: string | null = scope("blue").takeUnless((it: string) => {
  return it === "red";
});

blue === "blue"; // true
```

### ALIASES

A lot of the method names are reserved keywords. Usualy transpilers,
runtimes, and bundlers are smart enough to handle this based on context,
but if for some reason you don't want to use reserved keywords, the
following aliases are available:

```typescript
const scoped = scope(null);

scoped.let   === scoped.letFunc;
scoped.with  === scoped.withFunc;
scoped.run   === scoped.runFunc;
scoped.apply === scoped.applyFunc;
scoped.also  === scoped.alsoFunc;

scoped.takeIf     === scoped.takeIfFunc;
scoped.takeUnless === scoped.takeUnlessFunc;
```


### Unscoped `run()`

```typescript
import { run } from 'scope-utilities';

const sameTimeTomorrow: Date = run(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    
    return date;
});
```

### Unscoped `run()` aliased to `returnOf()`

```typescript
import { returnOf } from 'scope-utilities';

const sameTimeTomorrow: Date = returnOf(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    
    return date;
});
```

## Async / Await Support

All the function work it async / await or promise based functions. Just
make sure to also await on the return value.

```typescript
import { scope } from 'scope-utilities';

const sameTimeTomorrow: string = await scope(new Date()).let(async (it: Date) => {
    it.setDate(it.getDate() + 1);
    return it.toISOString();
});
```


## License
MIT