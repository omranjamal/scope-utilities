![npm](https://img.shields.io/npm/v/scope-utilities)
![NPM](https://img.shields.io/npm/l/scope-utilities)
![GitHub issues](https://img.shields.io/github/issues/omranjamal/scope-utilities)
![npm bundle size](https://img.shields.io/bundlephobia/min/scope-utilities)
![npm](https://img.shields.io/npm/dw/scope-utilities)
![GitHub forks](https://img.shields.io/github/forks/omranjamal/scope-utilities)
![GitHub Repo stars](https://img.shields.io/github/stars/omranjamal/scope-utilities)


# scope-utilities

> A library that helps you replace multiple variables and statements
> into a single type-safe & functional expression.

## Features

- Chaining
- Great Type Inference
- Async / Await Support

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

### `scope(VALUE).also(FUNC).value()`

- Passes `VALUE` into first argument of `FUNC`
- Returns `VALUE`


#### Realistic Example

Contain changes to mutable objects:

```ts
const nearest_date = false;

const dateForNextWeek: Date = scope(new Date())
  .also((date) => {
      date.setDate(date.getDate() + 7)
  }).also(date => {
      if (nearest_date) {
          date.setHours(0)
          date.setMinutes(0)
          date.setSeconds(0)
          date.setMilliseconds(0)
      }
  }).value();
```

### `scope(VALUE).let(FUNC).value()`

- Passes `VALUE` into first argument of `FUNC`
- Returns the result of `FUNC`

#### Realistic example

Conditionally building queries:

```ts
const query = await scope(
        startQuery()
    ).let((query) =>
        shuoldIncludeContactDetails()
          ? query.select(['id', 'email', 'COUNT(*) as post_count'])
          : query.select(['id', 'COUNT(*) as post_count'])
    ).let(async (query) => 
        await shouldReturnActiveOnly()
            ? query.where({ active: true })
            : query
    ).let((query) =>
        query.groupBy('id') // no need to await `query` here.
    ).let(query =>
        shouldSortBy() === 'post_count'
            ? query.orderBy('post_count')
            : shouldSortBy() === 'signup_time'
            ? query.orderBy('created_at')
            : query
    )
    .value();

const results = query.execute();
```

### `run(FUNC).value()`

- Runs `FUNC` and returns the result
- You can chain it with other scope functions if you like.

```ts
const newUser = await run(async () => {
    return await queryUser();
}).let((user) => {
    return user.clone();
}).also((user) => {
    user.setName('John Doe');
}).let(async () => {
    return await user.save();
}).value();
```

## License
MIT