# glualint-lsp

A [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) wrapper around the [`glualint`](https://github.com/FPtje/GLuaFixer) CLI.

## Requirements

`glualint-lsp` requires `glualint` but does not bundle it, either download the latest version [here](https://github.com/FPtje/GLuaFixer/releases) or build it from scratch.\
`glualint` is expected to be available in your `PATH`, otherwise `glualint-lsp` won't be able to provide any diagnostics or formatting.

## Installation

`glualint-lsp` is available on [npm](https://www.npmjs.com/package/glualint-lsp) and can be installed globally using the package manager of your choice.

### Using npm

```sh
npm install -g glualint-lsp
```

### Using pnpm

```sh
pnpm add -g glualint-lsp
```

## Usage

`glualint-lsp` communicates over stdio and is meant to be spawned by an editor or IDE, not run interactively:

```sh
glualint-lsp --stdio
```
