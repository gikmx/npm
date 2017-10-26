import { CLIEngine as EsLint } from 'eslint';
import Path from '../path';
import { $fromConfig } from '../config';

/**
 * @module lint
 * @memberof gik-npm.Scripts
 * @description Validates the code complies with certain rules.
 * It's recommended that you install one of the flavours of
 * [eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
 * it will be as easy as to include an `.eslintrc` file extending the module.
 *
 * @param {string|Array} [target=src] - The target directory to lint.
 *
 * @returns {gik-npm.Types.Observable} - An observable which `gik-npm` will subscribe to
 * in order to execute it.
 *
 * @example @lang js <caption>package.json</caption>
 * {
 *     "directories": {
 *         "example": './example'
 *     },
 *     "scripts": {
 *         "lint": "gik-npm lint example"
 *     },
 *     "devDependencies": {
 *          "@gik/eslint-config-node": "x.x.x" // Pick a flavour according to your project
 *     }
 * }
 *
 * @example @lang js <caption>.eslintrc</caption>
 * {
 *     "extends": "@gik/node" // Same as the module but without "eslint-config"
 * }
 */
export default function $fromScriptLint(target = 'src') {
    return $fromConfig()
        .do((config) => {
            const lint = new EsLint({ cwd: Path.cwd });
            const report = lint.executeOnFiles([config.directories[target]]);
            process.stdout.write(EsLint.getFormatter()(report.results));
            if (!report.errorCount) return true;
            throw new Error('\nFound errors, please correct them before continuing.');
        })
        .mapTo({
            status: 0,
            message: `${target} lint OK.`,
        });
}
