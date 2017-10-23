import PATH from 'path';
import { $ } from '@gik/tools-streamer';
import Path from '../path';
import Out from '../out';
import { $fromConfig } from '../config';

/**
 * @module test
 * @memberof gik-npm.Scripts
 * @type {script}
 * @description Runs all test found in the `$npm_package_directories_test` directory.
 * It uses internally [AVA](https://github.com/avajs/ava) as test runner, and
 * [nyc](https://github.com/istanbuljs/nyc) for coverage reports. Everything is configured
 * with the same [configuration](#gik-npm.Scripts.build.configuration) as the
 * [`build`](#gik-npm.Scripts.build) script with the difference that files aren't
 * transpiled, instead they're run using `babel-register`.
 *
 * ###### Availabe subcommands
 * - `cover` Generates coverage report after tests.
 *   - `check` Verifies if coverage passes threshold. (uses `.nycrc` on `test` dir)
 *   - `report` Outputs the last report.
 *     - `lcov` Outputs the last report using lcov instead.
 *
 * @param {...string} [task] - One on the subactions.
 *
 * @example @lang js <caption>package.json</caption>
 * {
 *     "directories": {
 *         "test": "./test"
 *     },
 *     "scripts": {
 *         "test": "gik-npm test", // runs test on all files on "./test"
 *         "test:cover": "gik-npm test cover", // runs test and generates coverage report
 *     }
 * }
 */
export default function Test(task = undefined) {
    const tasks = {
        cover: { run: 1, cmd: 'npx nyc --require=babel-register --cwd=%' },
        'cover-check': { run: 0, cmd: 'npx nyc check-coverage --cwd=%' },
        'cover-report': { run: 0, cmd: 'npx nyc report --reporter=text --color --cwd=%' },
        'cover-report-lcov': { run: 0, cmd: 'npx nyc report --reporter=text-lcov --cwd=%' },
    };
    if (task && !tasks[task]) return Out.error(new Error('Invalid test task'));
    return $fromConfig()
        .switchMap((config) => {
            const path = PATH.resolve(config.directories.test);
            const pfix = task ? `${tasks[task].cmd.replace('%', path)} ` : '';
            const test = `npx ava ${path} --verbose --color=always`;
            const cmd = [pfix, !task || (task && tasks[task].run) ? test : ''].join('');
            return $.fromSpawn(cmd, {
                cwd: Path.cwd,
                env: Object.assign(process.env, {
                    NODE_PATH: [
                        process.env.NODE_PATH,
                        Path.node_modules,
                        PATH.join(Path.cwd, 'node_modules'),
                    ].filter(Boolean).join(':'),
                }),
            });
        })
        .subscribe(
            function onSuccess(output) {
                if (output.type !== 'close') return process[output.type].write(output.data);
                const message = 'Finished.';
                if (output.code !== 1) Out.good(message);
                else Out.warn(message);
                return process.exit(output.code);
            },
            Out.error,
        );
}
