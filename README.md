oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g maid
$ maid COMMAND
running command...
$ maid (--version)
maid/0.0.0 darwin-arm64 node-v20.3.1
$ maid --help [COMMAND]
USAGE
  $ maid COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`maid hello PERSON`](#maid-hello-person)
* [`maid hello world`](#maid-hello-world)
* [`maid help [COMMANDS]`](#maid-help-commands)
* [`maid plugins`](#maid-plugins)
* [`maid plugins:install PLUGIN...`](#maid-pluginsinstall-plugin)
* [`maid plugins:inspect PLUGIN...`](#maid-pluginsinspect-plugin)
* [`maid plugins:install PLUGIN...`](#maid-pluginsinstall-plugin-1)
* [`maid plugins:link PLUGIN`](#maid-pluginslink-plugin)
* [`maid plugins:uninstall PLUGIN...`](#maid-pluginsuninstall-plugin)
* [`maid plugins:uninstall PLUGIN...`](#maid-pluginsuninstall-plugin-1)
* [`maid plugins:uninstall PLUGIN...`](#maid-pluginsuninstall-plugin-2)
* [`maid plugins update`](#maid-plugins-update)

## `maid hello PERSON`

Say hello

```
USAGE
  $ maid hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/cli/maid/blob/v0.0.0/dist/commands/hello/index.ts)_

## `maid hello world`

Say hello world

```
USAGE
  $ maid hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ maid hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/cli/maid/blob/v0.0.0/dist/commands/hello/world.ts)_

## `maid help [COMMANDS]`

Display help for maid.

```
USAGE
  $ maid help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for maid.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.16/src/commands/help.ts)_

## `maid plugins`

List installed plugins.

```
USAGE
  $ maid plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ maid plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/index.ts)_

## `maid plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ maid plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ maid plugins add

EXAMPLES
  $ maid plugins:install myplugin 

  $ maid plugins:install https://github.com/someuser/someplugin

  $ maid plugins:install someuser/someplugin
```

## `maid plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ maid plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ maid plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/inspect.ts)_

## `maid plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ maid plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ maid plugins add

EXAMPLES
  $ maid plugins:install myplugin 

  $ maid plugins:install https://github.com/someuser/someplugin

  $ maid plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/install.ts)_

## `maid plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ maid plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ maid plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/link.ts)_

## `maid plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ maid plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ maid plugins unlink
  $ maid plugins remove
```

## `maid plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ maid plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ maid plugins unlink
  $ maid plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/uninstall.ts)_

## `maid plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ maid plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ maid plugins unlink
  $ maid plugins remove
```

## `maid plugins update`

Update installed plugins.

```
USAGE
  $ maid plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.2.5/src/commands/plugins/update.ts)_
<!-- commandsstop -->
