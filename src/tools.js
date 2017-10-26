import { inspect as INSPECT } from 'util';
import { $ } from '@gik/tools-streamer';
import Shell from 'shelljs';
import Chalk from 'chalk';
import Logger from 'debug';

/**
 * @module Tools
 * @memberof gik-npm
 * @private
 */

/**
 * @memberof gik-npm.Tools
 * @description Makes debugging a little bit prettier.
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

/**
 * @memberof gik-npm.Tools
 * @description Join interface to [shelljs](https://github.com/shelljs/shelljs) to
 * attempt to run CLI commands in any OS.
 *
 * @param {string} command - a command to run on the OS,
 * @param {Object} [config] - the configuration options available.
 * @param {boolean} [config.silent=true] - Wether the output should be silenced.
 *                                         (only valid for 'exec')
 * @param {Object} [shell] - the library to use.
 * @returns {Observable.<Array>} - An array containing both stderr and stdout.
 * @private
 */
export const $fromShell = function $fromShell(command, config = {}, shell = Shell) {
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
    return cmd$;
};

export default { Debug, $fromShell };
