![npm](https://img.shields.io/npm/v/monotab)
![NPM](https://img.shields.io/npm/l/monotab)
![GitHub issues](https://img.shields.io/github/issues/omranjamal/monotab)
![npm bundle size](https://img.shields.io/bundlephobia/min/monotab)
![npm](https://img.shields.io/npm/dw/monotab)
![GitHub forks](https://img.shields.io/github/forks/omranjamal/monotab)
![GitHub Repo stars](https://img.shields.io/github/stars/omranjamal/monotab)


# monotab

![monotab demo](https://github.com/omranjamal/monotab/blob/static/monotab-demo.gif?raw=true)

> A command to (really quickly) open a new terminal tab in any of the directories or submodules in your repo.

## Features

- Duplicate terminal: `Ctrl` + `Shift` + `T` but in command form.
- Open tab from anywhere under a repo: Automatically detects the repo root.
- Support for `cd`-ing in current terminal (useful over ssh, or in IDE integrated terminal)
- Automatically picks up submodules and git repos.
- Include any directory (even if they aren't submodules) via glob patterns.
- Exclude any directory.
- Interactive directory picker with filtering.
- Filter as first argument for faster filtering.
- Automatically opens tab if there is only one match.

**Note:** `monotab` works best with repositories that have multiple submodules, but true monorepos are supported via `.monotabrc.json`.

See the [Configuration](#configuration) section for available
configuration options, and the example configuration on 
how to setup monorepos.

## Installation

```bash
npm install -g monotab
```

## Usage

### Basics

Just write `monotab` or `mtab` under any repository that contains submodules, and it should start working.

```bash
# this starts an interactive directory selector
monotab

# this one too, use them interchangably
mtab
```

### Tab Duplication

```bash
# this is just using the filter and relying on the
# assumption that this will only have one listing.

mtab .
```

Alternatively. Launch `mtab` press `.` and then press `Enter`

Alternatively to the alternative: Launch `mtab` and then press `Enter`

### Filter The List

Launch `mtab` then start typing.

Alternatively, pass in a second argument to pre-filter
the list.

```bash
# this will only show a list where the items all
# have "end" in them.

mtab end
```

## Configuration

You may create a `.monotabrc.json` file the root
directory of your repository and `monotab` will automatically
load it. This is especially useful for monorepos where
the subdirectiories are not necessarily git submodules.

The file should be a json file in the following format.

```typescript
interface MonotabConfigFileInterface {
    include: string | string[];
    exclude: string | string[];
}
```

Both `include` and `exclude` can be a string or an array of strings
that are glob patterns. Monotab uses [sindresorhus/globby](https://github.com/sindresorhus/globby) under the hood to support this.

### Example Monorepo Configuration

`.monotabrc.json`

```json
{
    "include": [
        "packages/*",
        "infra/*"
    ],
    "exclude": [
        "**/node_modules/**"
    ]
}
```

## Setup `cd` In Current Terminal

If you don't want to open a new terminal tab, or if you are using a terminal over SSH or if you're using your IDE's integrated terminal
(like on WebStorm or VSCode), `cd`-ing is your best friend.

To this you will need to add an alias to your `.bashrc` or `.zshrc`

```bash
# Assuming you use bash

printf "\n# monotab\neval \$(monotab --alias)\n" >> ~/.bashrc
```

Now you can use `monocd` to get the familiar interactive CLI,
but instead of opening a new terminal tab, it will cd you
to the directory.

### Customizing the Alias

Just pass in a value to `--alias`

```bash
printf "\n# monotab\neval \$(monotab --alias cdm)\n" >> ~/.bashrc
```

Open running this, your alias will be `cdm` instead of `monocd`.

### Alias Performance

> ...but node.js' startup time is far too slow
> it's making my terminal slow.

We hear you, I hate slow terminal startups too.
Just go into your `.bashrc` or `.zshrc` and paste the following at the end.

```bash
function monocd {
    DIR_PATH=$( [[ ! -z "$1" ]] && (mtab $1 --notab 3>&1 1>&2 2>&3) || (mtab --notab 3>&1 1>&2 2>&3) );
    [[ ! -z "$DIR_PATH" ]] && cd $DIR_PATH || echo "CANCELLED";
};
```

Replaced `monocd` with anything else if you want the command to be called anything other than `monocd`.

## Behaviour

### Repo Root Detection

`monotab` travels up the chain of directories from current working directory
and looks for the `.git` directory or the `monotabrc.json` file. If there are multiple
along the parent directory chain, the directory that matches at the highest level
is used.

### Filter

Filter tries to match it with the entire path, but does not support matching brackets
of any kind.

### Singluar Match

If there is only a single match, `monotab` automatically creates a tab in that
single matched path.

## Supported On

`monotab` uses [mklement0/ttab](https://github.com/mklement0/ttab)
under the hood to create terminal tabs. As such the following
terminals are currnently supported on Linux and MacOS.

1. Linux
    - Gnome Terminal
2. MacOS
    - Terminal _(not tested)_
    - iTerm2 _(not tested)_

## Roadmap

- [x] `cd` assistance in current terminal
- [ ] Windows Terminal Support
- [ ] Directory Labels

## Known Issues

[enquirer/enquirer](https://github.com/enquirer/enquirer) has a
hard time handling brackets as input.

## License

CC0-1.0 (public domain)