# facteur

A lightweight tool for managing CHANGELOG.md.

## Install

```bash
>$ npm install facteur --save-dev
#or
>$ yarn add facteur -D
#or
>$ pnpm add facteur -D
```

## Usage

### CLI

#### lint

```bash
>$ facteur lint [options] <message>

# lint commit message format

# Options:
#  -h, --help  display help for command
```

#### create

```bash
>$ facteur create [options] [title]

# create CHANGELOG from git commits.

# Options:
#  -c. --config <path>  the path of config file.
#  -e, --end <commit>   generate the end point of the CHANGELOG.
#  -s, --scope <dir>    the directory to generate CHANGELOG.
#  -o, --output <path>  the file path to generate CHANGELOG.
#  -h, --help           display help for command
```

### API

#### lint

```ts
import { lint } from 'facteur';

lint(/* message */);
```

#### create

```ts
import { create } from 'facteur';

interface CreateConfig {
    /**
     * Create title of CHANGELOG group
     */
    title?: string;
    end?: string;
    scope?: string;
    formatter?: (commit: Commit) => Commit | false | null;
    /**
     * @default
     * 'CHANGELOG.md'
     */
    output?: string;
}

create(/* CreateConfig */);
```

## License

[MIT](./LICENSE)
