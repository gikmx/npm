import { transform as Babel } from 'babel-core';
import { Package, ConfigSync } from './config';

const config = ConfigSync()[Package.name].babel;

/**
 * @alias transformer
 * @memberof gik-npm.Scripts.test
 * @description Normally Jest uses its own transformer `jest-babel`, but for some reason
 * it's not working with the current configuration. So a simple transpiling is being done
 * with the same mechanisms used for the [build](#gik-npm.Scripts.build) script.
 *
 * @param {string} code - [Jest](https://github.com/facebook/jest) sends each
 * file contents in this string.
 *
 * @returns {string} - the transpiled code using [build](#gik-npm.Scripts.build)'s babel
 * configuration.
 */
export function process(code) {
    return Babel(code, config).code;
}

export default process;
