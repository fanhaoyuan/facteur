function resolve(changelog: string) {
    const entries: [string, string[]][] = [];

    const logs = changelog.split('\n').filter(Boolean);

    for (const log of logs) {
        if (log.startsWith('## ')) {
            const group = log.slice(3);

            entries.push([group, []]);
            continue;
        }

        const [, lastGroup] = entries[entries.length - 1];

        // belongs last group
        lastGroup.push(log);
    }

    return new Map(entries);
}

/**
 * Merge two changelog file
 */
export function merge(current: string, incoming: string) {
    const currentEntries = resolve(current);
    const incomingEntires = resolve(incoming);

    const staged: [string, string[]][] = [];

    for (const [title, logs] of incomingEntires) {
        if (currentEntries.has(title)) {
            currentEntries.set(title, currentEntries.get(title)!.concat(logs));
            continue;
        }

        staged.push([title, logs]);
    }

    const merged = [...staged, ...currentEntries]
        .map(([title, logs]) => {
            // Remove Duplicates
            return `## ${title}\n\n${[...new Set(logs)].join('\n')}`;
        })
        .join('\n\n');

    return merged;
}
