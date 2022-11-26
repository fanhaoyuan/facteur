import { defineConfig } from './lib';

export default defineConfig({
    formatter(commit) {
        let message = commit.message;

        if (/#\d/.test(message)) {
            message = message.replace(/#\d/, title => {
                return `[${title}](https://github.com/fanhaoyuan/facteur/pull/${title.slice(1)})`;
            });
        } else {
            message = message += ` ([${commit.hash}](https://github.com/fanhaoyuan/facteur/commit/${commit.hash}))`;
        }

        if (message.startsWith('feat:')) {
            message = `🚀 ${message}`;
        }

        if (message.startsWith('fix:')) {
            message = `🐛 ${message}`;
        }

        return {
            ...commit,
            message,
        };
    },
});
