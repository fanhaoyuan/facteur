import { Command } from 'commander';
import { name, version } from '../package.json';
import { lint } from '../lib';

const program = new Command();

program.name(name).usage('[command] [options]');
program.version(version, '-v, --version');

program
    .command('lint <message>')
    .description('lint commit message format')
    .action((message: string) => {
        lint(message);
    });
