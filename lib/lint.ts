import piccolors from 'picocolors';

/**
 * Check commit message whether a valid message format.
 * @param message
 */
export function lint(message: string) {
    const REG_EXP =
        /^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|release|merge)(\(.+\))?: .{1,50}/;

    if (!REG_EXP.test(message)) {
        console.log(piccolors.red(`[facteur]: <${piccolors.yellow(message)}> is an invalid commit message format.`));
        process.exit(1);
    }

    // console.log(piccolors.green('[facteur]: commit message passed.'));
}
