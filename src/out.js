// NPM modules
const Chalk = require('chalk');

exports.error = function error(err) {
    if (!(err instanceof Error)) {
        throw new TypeError(`Expecting Error instance, got: ${typeof err}`);
    }
    process.stderr.write(`${Chalk.red(err.message)}\n`);
    process.exit(1);
};

exports.custom = function custom(color, message) {
    const type = typeof color;
    if (type !== 'string') throw new TypeError(`Expecting string color, got: ${type}`);
    process.stdout.write(`${Chalk[color](String(message))}\n`);
};

exports.info = (...args) => exports.custom.call(exports, 'blue', ...args);
exports.warn = (...args) => exports.custom.call(exports, 'yellow', ...args);
exports.good = (...args) => exports.custom.call(exports, 'green', ...args);
