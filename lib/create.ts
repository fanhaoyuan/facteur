import * as path from 'path';
import { run, getDefaultValue } from './utils';
import picocolors from 'picocolors';
import * as fs from 'fs-extra';
import { merge } from './merge';
import { CreateConfig, Commit } from './interfaces';

function getHash(commit: string) {
    return run('git', 'rev-list', '-n', '1', commit)[0] || '';
}

function getFirstCommit() {
    const commits = run('git', 'rev-list', '--all');
    return commits[commits.length - 1];
}

function getCommitsInRange(start: string, end: string, scope: string) {
    return run('git', '--no-pager', 'log', `${end}...${start}`, '--oneline', scope);
}

function getTagList() {
    const refs = run('git', '--no-pager', 'log', '--oneline', '--format=%D');

    return refs
        .map(item => {
            return (
                item
                    .split(',')
                    .map(_ => _.trim())
                    .filter(_ => _.startsWith('tag:'))[0] || ''
            ).slice(5);
        })
        .filter(Boolean);
}

function getTagByCommit(commit: string) {
    return run('git', 'tag', '-l', '--contains', commit)[0];
}

/**
 * Create CHANGELOG form commit messages.
 * @param config
 * @returns
 */
export async function create(config: CreateConfig = {}) {
    const start = getHash('HEAD');

    const [firstTag, secondTag] = getTagList();

    const startTag = getTagByCommit(start);
    const firstCommit = getFirstCommit();

    const end = getHash(
        getDefaultValue(config.end, (startTag ? (secondTag ? secondTag : firstCommit) : firstTag) || firstCommit)
    );
    const title = startTag || 'Up to date';

    if (!start) {
        console.log(picocolors.red('[facteur]: Range is invalid. Must provide start tag or exist a tag in repo.'));
        process.exit(1);
    }

    const scope = getDefaultValue(config.scope, '.');

    let commits: Commit[] = getCommitsInRange(start, end, scope).map(msg => {
        const message = msg.slice(8);
        const hash = msg.slice(0, 7);

        return {
            message,
            hash,
        };
    });

    const formatter = getDefaultValue(config.formatter, commit => commit);

    commits = commits.map(commit => formatter(commit));

    if (!commits.length) {
        console.log(picocolors.yellow('[facteur]: This repo has not changed.'));
        return;
    }

    console.log(picocolors.cyan('[facteur]: Creating changelog...'));

    let log = `## ${title}\n\n`;

    for (const commit of commits) {
        log += `- ${commit.message}\n`;
    }

    const output = getDefaultValue(config.output, 'CHANGELOG.md');

    const dest = path.resolve(process.cwd(), scope, output);

    if (fs.pathExistsSync(dest)) {
        const originChangelog = fs.readFileSync(dest, 'utf-8');
        log = merge(originChangelog, log);
    }

    fs.writeFileSync(dest, log, 'utf-8');

    console.log(picocolors.green('[facteur]: Created changelog successfully.'));
}
