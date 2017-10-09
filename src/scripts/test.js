import PATH from 'path';
import Path from '../path';
import Out from '../out';
import { $fromConfig } from '../config';
import { $ } from '../tools';

/**
 * Runs all test found in the '$npm_package_directories_test' directory.
 * @module Test
 * @memberof Scripts
 */
export default function Test() {
    return $fromConfig()
        .switchMap(function exec(config) {
            const command = [
                'npm --prefix', Path.root, 'run command:test --',
                `${PATH.join(PATH.resolve(config.directories.test), '**', '*.js')}`,
                '--color=always --verbose',
            ].join(' ');
            return $.fromSpawn(command);
        })
        .subscribe(
            output => process[output.type].write(output.data),
            Out.error,
            () => Out.good('Test complete.'),
        );
}
