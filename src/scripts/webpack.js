import PATH from 'path';
import { inspect as INSPECT } from 'util';
import Webpack from 'webpack';
import WebpackMerge from 'webpack-merge';
import WebpackServer from 'webpack-dev-server';
import { Env, Path, Configurator } from '@gik/tools-configurator';
import { Is } from '@gik/tools-checker';
import { $ } from '@gik/tools-streamer';
import { $fromConfig, Package } from '../config';

const $fromScriptWebpack = pathKey => $fromConfig()
    .map(({ directories, [Package.name]: { webpack: { config, name } } }) => {
        // verify arguments
        if (!Is.string(pathKey) || !directories[pathKey]) {
            const msg = [
                `Invalid path: ${pathKey}: `,
                'Make sure is declared on "directories" on your package.json',
            ].join(' ');
            throw new Error(msg);
        }
        const path = PATH.resolve(directories[pathKey]);
        let context = {};
        if (Is.object(config) && !Is.objectEmpty(config)) {
            context = Configurator({
                ...config,
                path: PATH.resolve(config.path),
            });
        }
        return [name, `${name}-${Env}`].reduce((acc, cur) => {
            const mod = require(PATH.join(path, cur));
            if (!Is.function(mod)) throw new Error(`Invalid function ${cur}`);
            return {
                ...acc,
                webpack: WebpackMerge(acc.webpack, mod(acc)),
            };
        }, {
            ...context,
            path: Path,
            env: Env,
            webpack: {},
            [Package.name]: { path, config, name },
        });
    })
    .switchMap((config) => {
        const { webpack: configWebpack, [Package.name]: { path, name } } = config;
        process.stdout.write([
            '\n\nconfig.webpack:',
            INSPECT(configWebpack, { colors: true, depth: null }), '\n\n',
        ].join('\n'));
        const webpack = Webpack(configWebpack);
        if (Env === 'production') return $
            .bindNodeCallback(webpack.run.bind(webpack))()
            .do((stats) => {
                const out = [
                    '\n', stats.toString({ colors: true, chunks: false }), '\n',
                ].join('');
                if (stats.hasErrors()) throw new Error(out);
                process.stdout.write(out);
            });
        const configServer = require(PATH.join(path, `${name}-server`))(config);
        const { host, port } = configServer;
        process.stdout.write([
            '\n\nconfig.devServer:',
            INSPECT(configServer, { colors: true, depth: null }),
        ].join('\n'));
        const server = new WebpackServer(webpack, configServer);
        return $
            .bindCallback(server.listen.bind(server))(port, host)
            .do(() => process.stdout.write(`\n\n Listening on ${host}:${port}\n\n`));
    })
    .mapTo({
        status: 0,
        message: 'Sucessfully ran webpack',
    });

export default $fromScriptWebpack;
