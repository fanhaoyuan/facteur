import * as path from 'path';
import { run } from './utils';
import picocolors from 'picocolors';
import * as fs from 'fs-extra';
import { merge } from './merge';

export interface Commit {
    message: string;
    hash: string;
}

export interface CreateOptions {
    range?: string[];
    scope?: string;
    formatter?: (commit: Commit) => Commit;
    /**
     * @default
     * 'CHANGELOG.md'
     */
    output?: string;
}

function getHash(tag: string) {
    const [hash] = run('git', 'rev-list', '-n', '1', tag);
    return hash;
}

function getLastTag() {
    const [tag = ''] = run('git', 'tag', '-l');
    return tag;
}

export async function create(options: CreateOptions = {}) {
    const { range = [], scope = '.', formatter, output = 'CHANGELOG.md' } = options;

    const [start = getLastTag(), end = 'HEAD'] = range;

    if (!start) {
        console.log(picocolors.red('[facteur]: Range is invalid. Must provide start tag or exist a tag in repo.'));
        process.exit(1);
    }

    const hashRange = [getHash(start), getHash(end)];

    let commits: Commit[] = run('git', '--no-pager', 'log', hashRange.join('...'), '--oneline', scope).map(msg => {
        const message = msg.slice(8);
        const hash = msg.slice(0, 7);

        return {
            message,
            hash,
        };
    });

    if (formatter) {
        commits = commits.map(commit => formatter(commit));
    }

    if (!commits.length) {
        console.log(picocolors.yellow('[facteur]: This repo has not changed.'));
        return;
    }

    console.log(picocolors.cyan('[facteur]: Creating changelog...'));

    let log = `## ${end}\n\n`;

    for (const commit of commits) {
        log += `- ${commit.message}\n`;
    }

    const dest = path.resolve(process.cwd(), scope, output);

    if (fs.pathExistsSync(dest)) {
        const originChangelog = fs.readFileSync(dest, 'utf-8');
        log = merge(originChangelog, log);
    }

    fs.writeFileSync(dest, log, 'utf-8');

    console.log(picocolors.green('[facteur]: Created changelog successfully.'));
}
