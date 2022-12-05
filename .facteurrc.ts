import { defineConfig } from './lib';

export default defineConfig({
    formatter(commit) {
        let message = commit.message;

        if (/#\d/.test(message)) {
            message = message.replace(/#\d+/g, title => {
                return `[${title}](https://github.com/fanhaoyuan/facteur/pull/${title.slice(1)})`;
            });
        } else {
            message = message += ` ([${commit.hash}](https://github.com/fanhaoyuan/facteur/commit/${commit.hash}))`;
        }

        if (commit.type === 'feat') {
            return `🚀 ${message}`;
        }

        if (commit.type === 'fix') {
            return `🐛 ${message}`;
        }

        if (commit.type === 'refactor') {
            return `🔧 ${message}`;
        }

        return false;
    },
});
