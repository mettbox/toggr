togglr
======

Toggl time tracking reports CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/togglr.svg)](https://npmjs.org/package/togglr)
[![Downloads/week](https://img.shields.io/npm/dw/togglr.svg)](https://npmjs.org/package/togglr)
[![License](https://img.shields.io/npm/l/togglr.svg)](https://github.com/mettbox/togglr/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g togglr
$ togglr COMMAND
running command...
$ togglr (-v|--version|version)
togglr/0.0.1 darwin-x64 node-v15.4.0
$ togglr --help [COMMAND]
USAGE
  $ togglr COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`togglr hello [FILE]`](#togglr-hello-file)
* [`togglr help [COMMAND]`](#togglr-help-command)

## `togglr hello [FILE]`

describe the command here

```
USAGE
  $ togglr hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ togglr hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/mettbox/togglr/blob/v0.0.1/src/commands/hello.ts)_

## `togglr help [COMMAND]`

display help for togglr

```
USAGE
  $ togglr help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
