import { Command } from 'commander';
import { name } from '../package.json';
import { lint } from '../lib';

const program = new Command();

program.name(name).usage('[command] [options]');

program
    .command('lint <message>')
    .description('lint commit message format')
    .action((message: string) => {
        lint(message);
    });
