import { CLIEngine as EsLint } from 'eslint';
import Path from '../path';
import Out from '../out';
import { $fromConfig } from '../config';

/**
 * Validates the code complies with certain rules.
 * It's recommended that you install one of the flavours of
 * [eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
 * it will be as easy as to include an `.eslintrc` file extending the module.
 * @module Lint
 * @memberof Scripts
 *
 * @param {string} [target='src'] - The target directory to lint (src by default),
 *
 * @example <caption>`package.json`</caption>
 * {
 *     "directories": {
 *         "example": './example'
 *     },
 *     "scripts": {
 *         "lint": "gik-npm lint:example"
 *     },
 *     "devDependencies": {
 *          "@gik/eslint-config-node": "x.x.x" // Pick a flavour according to your project
 *     }
 * }
 *
 * @example <caption>`.eslintrc`</caption>
 * {
 *     "extends": "@gik/node" // Same as the module but without "eslint-config"
 * }
 */
export default function Lint(target = 'src') {
    return $fromConfig()
        .do((config) => {
            const lint = new EsLint({ cwd: Path.cwd });
            const report = lint.executeOnFiles([config.directories[target]]);
            process.stdout.write(EsLint.getFormatter()(report.results));
            if (!report.errorCount) return true;
            // Throw an error but omit the stack trace.
            const err = Error('\nFound errors, please correct them before continuing.');
            err.stack = '';
            throw err;
        })
        .mapTo('Lint succesful.')
        .subscribe(Out.good, Out.error);
}
