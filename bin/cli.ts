import { Command } from 'commander';
import { create, lint, CreateConfig, Config } from '../lib';
import { extract } from 'config-extracter';

const program = new Command();

const defaultConfigFiles = ['.ts', '.js'].map(ext => `${process.cwd()}/.facteurrc${ext}`);

program
    .command('lint <message>')
    .description('lint commit message format')
    .action((message: string) => {
        lint(message);
    });

program
    .command('create [title]')
    .description('create CHANGELOG from git commits.')
    .option('-c. --config <path>', 'the path of config file.')
    .option('-e, --end <commit>', 'generate the end point of the CHANGELOG.')
    .option('-s, --scope <dir>', 'the directory to generate CHANGELOG.')
    .option('-o, --output <path>', 'the file path to generate CHANGELOG.')
    .action(async (title?: string, userConfig: CreateConfig & Pick<Config, 'config'> = {}) => {
        const config =
            (await extract<Config>({
                file: userConfig.config || defaultConfigFiles,
            })) || {};

            console.log(config);

        await create(Object.assign({}, config, userConfig, { title }));
    });

program.parse();
