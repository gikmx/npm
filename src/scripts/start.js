import Nodemon from 'nodemon';
import { $ } from '@gik/tools-streamer';
import { Package, $fromConfig } from '../config';

/**
 * @module start
 * @memberof gik.Scripts
 * @description A watcher for your scripts using [nodemon](http://github.com/remy/nodemon).
 *
 * Below are the default properties that are being sent to the `nodemon` binary.
 *
 * @property {boolean} [verbose=true] - Show details of what's happening.
 * @property {string} [ext=js json] - The extensions that triggers changes.
 * @property {Array} [watch=[...$npm_package_directories]] - The directories to monitor.
 *
 * @param {string} exec - The command to run whenever changes are found.
 *
 * @returns {gik.Types.Observable} - An observable which `gik` will subscribe to
 * in order to execute it.
 *
 * @see https://github.com/remy/nodemon#config-files
 */
export default function $fromScriptStart(exec) {
    return $fromConfig()
        .map(config => ({
            exec,
            ...config[Package.name].nodemon,
            watch: Object
                .keys(config.directories)
                .filter(key => key !== 'out')
                .map(key => config.directories[key]),
        }))
        .switchMap(cfg => $.create(() => Nodemon(cfg)
            .on('log', m => process.stdout.write(`${m.colour}\n`))
            .on('quit', () => process.exit(0))),
        );
}
