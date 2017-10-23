import PATH from 'path';
import { inspect as INSPECT } from 'util';
import { $ } from '@gik/tools-streamer';
import Shell from 'shelljs';
import Chalk from 'chalk';
import Logger from 'debug';
import Package from '../package.json';

/**
 * @module Tools
 * @memberof gik-npm
 * @private
 */

/**
 * Makes debugging a little bit prettier.
 * @memberof gik-npm.Tools
 * @param {string} context - An identifier to pass on to debug.
 * @see https://github.com/visionmedia/debug
 * @private
 */
export function Debug(context) {
    const debug = Logger(context);
    return function debugCreate(subject, ...args) {
        const parts = subject.split(':');
        if (parts.length < 2) return debug(subject, ...args);
        let title = ` ${parts.shift()} `;
        const type = parts.shift();
        if (type === 'ini') title = Chalk.bgYellowBright.black(title);
        else if (type === 'end') title = Chalk.bgGreenBright.black(title);
        else title = Chalk.inverse(title);
        return debug(title, ...args.map(arg => INSPECT(arg, {
            depth: 1,
            colors: true,
            breakLength: Infinity,
            showHidden: false,
        })));
    };
}

const debug = Debug([
    Package.name,
    PATH.basename(__filename, PATH.extname(__filename)),
].join(':'));

/**
 * An interface to [shelljs](https://github.com/shelljs/shelljs) to "attempt" to run
 * CLI commands in any OS.
 *
 * @param {string} command - a command to run on the OS,
 * @param {Object} [config]
 * @param {Boolean} [config.silent=true] - Wether the output should be silenced.
 *                                         (only valid for 'exec')
 * @returns {Observable.<Array>} - An array containing both stderr and stdout.
 * @memberof gik-npm.Tools
 * @private
 */
export const $fromShell = function $fromShell(command, config = {}, shell = Shell) {
    debug('$fromShell:ini', command);
    const args = command.split(/\s/g);
    const cmd = args.shift().toLowerCase();
    let cmd$;

    // custom execution
    if (cmd === 'exec') cmd$ = $.bindNodeCallback(
        shell[cmd])(args.join(' '),
        Object.assign({ silent: true }, config),
    );

    // async commands.
    // TODO: Add async commands.

    // sync commands (almost all shelljs is sync)
    else cmd$ = $.of(shell[cmd](...args)).mapTo(true);
    return cmd$.do(stdout => debug('$fromShell:end', command, stdout));
};

export default { Debug, $fromShell };
