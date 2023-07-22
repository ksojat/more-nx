# Nx Conventional Commitlint integration

Part of monorepo [More-Nx](https://github.com/ksojat/more-nx).

## Conventional Commitlint

Integration between Nx and [Conventional Commitlint](https://commitlint.js.org/#/).

If just starting and you are using VSC for development use `@more-nx/commitlint:setup`, in other cases use `@more-nx/commitlint:config`.

### Install

```sh
  npm install --save-dev @more-nx/commitlint
```

### Available generators

| Generator | Description |
|-----------|-------------|
| @more-nx/commitlint:setup | Generate configuration and add recommended extensions |
| @more-nx/commitlint:config | Generate basic commitlint configuration |
| @more-nx/commitlint:vsc-extensions | Add recommended Visual Studio Code extensions |

## Building

Run `nx build commitlint` to build the library.

## Running unit tests

Run `nx test commitlint` to execute the unit tests via [Jest](https://jestjs.io).
