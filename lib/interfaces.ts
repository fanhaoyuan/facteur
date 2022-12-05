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

export interface Config extends CreateConfig {
    /**
     * config file path
     *
     * @default
     * `${process.cwd()}/.facteurrc.(t|j)s`
     */
    config?: string;
}
