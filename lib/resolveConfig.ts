import * as fs from 'fs-extra';
import * as path from 'path';
import { Config } from './interfaces';
import picocolors from 'picocolors';
import { build } from 'esbuild';

const supportedConfigFiles = ['.ts', '.js'];

export async function resolveConfig(configFile = ''): Promise<Config> {
    if (!configFile || !fs.pathExistsSync(configFile)) {
        return {};
    }

    const configFileExtname = path.extname(configFile);

    if (!supportedConfigFiles.includes(configFileExtname)) {
        console.log(picocolors.red(`[facteur]: ${configFileExtname} config file is not support.`));
        process.exit(1);
    }

    let config: Config = {};

    if (configFileExtname === '.ts') {
        const { outputFiles } = await build({
            entryPoints: [configFile],
            outdir: 'out.js',
            write: false,
            platform: 'node',
            bundle: true,
            format: 'cjs',
            plugins: [
                {
                    name: 'externalize-deps',
                    setup(b) {
                        b.onResolve({ filter: /.*/ }, args => {
                            const id = args.path;
                            if (id[0] !== '.' && !path.isAbsolute(id)) {
                                return {
                                    external: true,
                                };
                            }
                        });
                    },
                },
            ],
        });

        const tempFilePath = path.resolve(__dirname, 'config.js');

        fs.writeFileSync(tempFilePath, outputFiles[0].text, 'utf-8');

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        config = require(tempFilePath).default;

        fs.removeSync(tempFilePath);
    }

    if (configFileExtname === '.js') {
        config = require(configFile);
    }

    return config;
}
