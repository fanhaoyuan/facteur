import { Command } from 'commander';
import { create, lint, CreateConfig, Config, resolveConfig } from '../lib';
import glob from 'fast-glob';
import { getDefaultValue } from '../lib/utils';

const program = new Command();

const defaultConfigFile = glob.sync(`${process.cwd()}/.facteurrc.(t|j)s`)[0];

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
        const configFile = getDefaultValue(userConfig.config, defaultConfigFile);

        const config = await resolveConfig(configFile);

        await create(Object.assign({}, config, userConfig, { config: configFile, title }));
    });

program.parse();
