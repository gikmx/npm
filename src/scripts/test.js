import PATH from 'path';
import { $ } from '@gik/tools-streamer';
import { runCLI as Jest } from 'jest-cli';
import { Package, $fromConfig } from '../config';
import Path from '../path';

/**
 * @module test
 * @memberof gik-npm.Scripts
 * @description Runs unit tests using [Jest](http://github.com/facebook/jest).
 * This script makes no assumptions for the jest configurations, it just transpiles the
 * test files using the same configuration as the [build](#gik-npm.Scripts.build) script
 * and uses Jest's defaults. Below is the configuration file used by the script.
 *
 * ###### Default configuration `.jest.js`
 * ```javascript
 * <<<file:root/.jest.js>>>
 * ```
 *
 * you can customize the arguments sent to the `jest` cli interface by changing the
 * following properties on `package.json`.
 *
 * @property {Array} [projects=path/to/your/project] - The projects to test.
 * @property {string} [rootDir=path/to/your/project] - Just will run on this context.
 * @property {string} [config=path/to/default/config] - Use this file to customize further.
 *
 * @returns {gik-npm.Types.Observable} - An observable which `gik-npm` will subscribe to
 * in order to execute it.
 *
 * @example @lang js <caption>package.json</caption>
 * {
 *     "@gik/npm": {
 *          "jest": {
 *               "config": "path/to/your/config",
 *          }
 *      }
 *     "scripts": {
 *         "test": "gik-npm test", // runs test on all files on "./test"
 *         "test:cover": "gik-npm test cover", // runs test and generates coverage report
 *     }
 * }
 */
export default function $fromScriptTest() {
    return $fromConfig()
        .map(config => config[Package.name].jest)
        .switchMap((config) => {
            if (!Array.isArray(config.projects))
                throw new Error('Expecting a projects array');
            process.env.NODE_PATH = [
                process.env.NODE_PATH,
                Path.node_modules,
                PATH.join(Path.cwd, 'node_modules'),
            ].join(':');
            return $.fromPromise(Jest(config, config.projects));
        })
        .map(jest => ({
            status: jest.results.success ? 0 : 1,
            message: 'Finished testing.',
        }));
}

