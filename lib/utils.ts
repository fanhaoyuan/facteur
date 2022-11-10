import { spawnSync } from 'child_process';

/**
 * Run script
 * @param command
 * @param options
 * @returns
 */
export function run(command: string, ...options: string[]) {
    const { stdout } = spawnSync(command, options);

    return stdout
        .toString()
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);
}
