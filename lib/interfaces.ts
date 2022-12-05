export interface LintConfig {
    /**
     * @default
     * ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'workflow', 'build', 'ci', 'chore', 'types', 'release', 'merge']
     */
    types?: string[];
}
export interface Commit {
    message: string;
    hash: string;
    type: string;
}

export interface CreateConfig {
    /**
     * Create title of CHANGELOG group
     */
    title?: string;
    end?: string;
    scope?: string;
    formatter?: (commit: Commit) => Commit | false | null | string;
    /**
     * @default
     * 'CHANGELOG.md'
     */
    output?: string;
}

export interface Config extends CreateConfig, LintConfig {
    /**
     * config file path
     *
     * @default
     * `${process.cwd()}/.facteurrc.(t|j)s`
     */
    config?: string;
}
