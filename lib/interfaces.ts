export interface Commit {
    message: string;
    hash: string;
}

export interface CreateConfig {
    end?: string;
    scope?: string;
    formatter?: (commit: Commit) => Commit;
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
