import PATH from 'path';
import Path from '../path';
import Out from '../out';
import { $fromConfig } from '../config';
import { $ } from '../tools';

/**
 * Runs all test found in the '$npm_package_directories_test' directory.
 * @module Test
 * @memberof Scripts
 * @param {string} [task=undefined] - One of the following actions:
 * @param task.cover - Generate coverage report after tests.
 * @param task.cover-check - Verify if coverage passes threshold. (use .nycrc on test dir)
 * @param task.cover-report - Output the last report.
 * @param task.cover-report-lcov - Output the last using lcov.
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
