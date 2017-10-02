// NPM modules
const Chalk = require('chalk');

Error.stackTraceLimit = Infinity;

exports.error = function error(err) {
    if (!(err instanceof Error)) {
        throw new TypeError(`Expecting Error instance, got: ${typeof err}`);
    }
    process.stderr.write(`${Chalk.red(err.message)}\n`);
    const stack = err.stack
        .split('\n')
        .slice(1)
        .filter(line => line.indexOf('node_modules') === -1)
        .join('\n');
    process.stderr.write(Chalk.gray(`${stack}\n`));
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
