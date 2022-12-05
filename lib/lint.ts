import piccolors from 'picocolors';
import { LintConfig } from './interfaces';
import { getDefaultValue } from './utils';

/**
 * Check commit message whether a valid message format.
 * @param message
 */
export function lint(message: string, config: LintConfig = {}) {
    const types = getDefaultValue(config.types, [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'workflow',
        'build',
        'ci',
        'chore',
        'types',
        'release',
        'merge',
    ]);

    const REG_EXP = new RegExp(`^(revert: )?(${types.join('|')})(\\(.+\\))?: .{1,50}`);

    if (!REG_EXP.test(message)) {
        console.log(piccolors.red(`[facteur]: <${piccolors.yellow(message)}> is an invalid commit message format.`));
        process.exit(1);
    }

    // console.log(piccolors.green('[facteur]: commit message passed.'));
}
