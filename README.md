# git-release-helper

A script that helps pushing code by git, building bundles and releasing version on remote server.

## Features

- Execute a series of git commands to repository automatically.

## Background

Tired of pushing code and releasing version to our development server with several manual operations, I have to try writing some scripts to help the releasing work to be easier.

> So, if you have more complex requirements, you should try to set up a CI.

## Install

```sh
$ npm install git-release-helper --save-dev
```
or
```sh
$ yarn add git-release-helper --dev
```

## Usage

1. Create a JSON file outside your project. It's used for connecting SSH.

```js
// Example path: D:\\myKey.json
```
```json
{
  "host": "127.0.0.1",
  "username": "admin",
  "password": "******"
}
```

2. Create a JSON file and change the info in `project\\grhconfig.json`.

```sh
$ grh init
```

3. Push your code, build your project, ect.

```sh
$ grh
```

## Maintainers

[@Scrooge6792](https://github.com/Scrooge6792).

## Contributing

Feel free to dive in! [Open an issue](https://github.com/Scrooge6792/git-release-helper/issues/new) or submit PRs.
