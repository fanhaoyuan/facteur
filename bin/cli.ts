import { Command } from 'commander';
import { create, lint, CreateOptions } from '../lib';

const program = new Command();

program
    .command('lint <message>')
    .description('lint commit message format')
    .action((message: string) => {
        lint(message);
    });

program
    .command('create')
    .description('create changelog to file')
    .option('-r, --range <tag...>', 'a range for create changelog')
    .option('-s, --scope <dir>', 'which scope should record change')
    .option('-o, --output <path>', 'Output changelog file path')
    .action(async (options: CreateOptions) => {
        await create(options);
    });

program.parse();
