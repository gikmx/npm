/**
 * @module Tools
 * @private
 */

import PATH from 'path';
import FS from 'fs';
import { inspect as INSPECT } from 'util';
import Shell from 'shelljs';
import Chalk from 'chalk';
import Logger from 'debug';
import { Observable } from 'rxjs';
import Package from '../package.json';

/**
 * Makes debugging a little bit prettier.
 * @memberof Tools
 * @param {string} context - An identifier to pass on to debug.
 * @see https://github.com/visionmedia/debug
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
 * RXjs Observables.
 * @memberof Tools
 */
export const $ = Observable;

/**
 * Determine if given path is accessible.
 * @memberof Tools.$
 * @param {string} path - A path to the node you want to check.
 * @returns {Observable.<boolean>} - Wether the file is accessible or not.
 */
$.fromAccess = function $fromAccess(path) {
    debug('$fromAccess:ini', path);
    return $.bindNodeCallback(FS.access)(path)
        .mapTo(path)
        .catch(() => $.of(false))
        .do(() => debug('$fromAccess:end', path));
};

/**
 * Determine statistics about a file system node.
 * @memberof Tools.$
 * @param {string} path - A path to the node you want to check.
 * @returns {Observable.<Object>} - stat object for the node.
 * @throws {Error} - When given an invalid node.
 * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
 */
$.fromStat = function $fromStat(path) {
    debug('$fromStat:ini', path);
    return $.bindNodeCallback(FS.stat)(path)
        .do(stat => debug('$fromStat:end', path, stat));
};

/**
 * An interface to [shelljs](https://github.com/shelljs/shelljs) to "attempt" to run
 * CLI commands in any OS.
 *
 * @memberof Tools.$
 * @param {string} command - a command to run on the OS,
 * @param {Object} [config]
 * @param {Boolean} [config.silent=true] - Wether the output should be silenced.
 *                                         (only valid for 'exec')
 * @returns {Observable.<Array>} - An array containing both stderr and stdout.
 */
$.fromShell = function $fromShell(command, config = {}) {
    debug('$fromShell:ini', command);
    const args = command.split(/\s/g);
    const cmd = args.shift().toLowerCase();
    let cmd$;

    // custom execution
    if (cmd === 'exec') cmd$ = $.bindNodeCallback(
        Shell[cmd])(args.join(' '),
        Object.assign({ silent: true }, config),
    );

    // async commands.
    // TODO: Add async commands.

    // sync commands (almost all shelljs is sync)
    else cmd$ = $.of(Shell[cmd](...args)).mapTo(true);
    return cmd$.do(stdout => debug('$fromShell:end', command, stdout));
};

/**
 * Creates a directory.
 * @memberof Tools.$
 * @param {string} path - The directory to be created.
 * @returns {Observable.<string>} - The path of the directory that was just created.
 * @throws {Error} - When directory cannot be created.
 */
$.fromDirMake = function $fromDirMake(path) {
    debug('$fromDirMake', path, 'ini');
    return $.bindNodeCallback(FS.mkdir)(path)
        .mapTo(path)
        .do(() => debug('$fromDirMake', path, 'end'));
};

/**
 * Requires a directory path, if the directory does not exists, it's created.
 * @memberof Tools.$
 * @param {string} path - The requested directory.
 * @returns {Observable.<string>} - The path of the directory.
 * @throws {Error} - When requested path exists and is not a directory.
 */
$.fromDirRequire = function $fromDirRequire(path) {
    path = PATH.resolve(path);
    debug('$fromDirRequire', path, 'ini');
    return $
        .fromStat(path)
        // path was not found, create the directory
        .catch(() => $.fromDirMake(path).mergeMapTo($.fromStat(path)))
        // path exists and is not a directory? that's an error.
        .map(function isDir(stat) {
            if (!stat.isDirectory())
                throw new Error(`Expecting "${path}" to be a directory.`);
            return path;
        })
        .do(() => debug('$fromDirRequire', path, 'end'));
};

/**
 * Get path of nodes in given directory (non recursively).
 * @memberof Tools.$
 * @param {string} path - The requested directory.
 * @returns {Observable.<Stream.<string>>} - The path of the directory.
 * @throws {Error} - When requested path exists and is not a directory.
 */
$.fromDirRead = function $fromDirRead(path) {
    debug('$fromDirRead:ini', path);
    return $.bindNodeCallback(FS.readdir)(path)
        .do(nodes => debug('fromDirRead:end', path, nodes))
        .concatMap(nodes => $.from(nodes))
        .map(node => PATH.join(path, node))
        .mergeMap(npath => $.fromStat(npath).map(stat => ({ stat, path: npath })));
};

/**
 * Get path of nodes in given directory (recursively).
 * @memberof Tools.$
 * @param {string} path - The requested directory.
 * @returns {Observable.<Stream.<string>>} - The path of the directory.
 * @throws {Error} - When requested path exists and is not a directory.
 */
$.fromDirReadRecursive = function $fromDirReadRecursive(path) {
    return $
        .fromDirRead(path)
        .mergeMap(node => !node.stat.isDirectory() ?
            $.of(node) :
            $.fromDirReadRecursive(node.path),
        );
};

/**
 * Reads a file from the disk.
 * @memberof Tools.$
 * @param {string} path - The path to the file to read.
 * @returns {Observable.<string>} - The contents of the file.
 */
$.fromFileRead = function $fromFileRead(path) {
    debug('$fromFileRead:ini', path);
    return $
        .fromAccess(path)
        .map(function readAccess(access) {
            if (!access) throw new Error(`Could not read ${access}`);
            return access;
        })
        .switchMapTo($.bindNodeCallback(FS.readFile)(path, 'utf-8'))
        .do(content => debug('$fromFileRead:end', path, content));
};

/**
 * Writes a file on the disk.
 * @memberof Tools.$
 * @param {string} path - The full path for the file.
 * @param {string} content - The contents of the file.
 * @returns {Observable.<string>} - The future value `true` if write was succesful.
 * @throws {Error} - When the file cannot be written.
 */
$.fromFileWrite = function $fromFileWrite(path, content) {
    debug('$fromFileWrite:ini', path);
    return $.bindNodeCallback(FS.writeFile)(path, content)
        .mapTo(true)
        .do(out => debug('$fromFileWrite:end', path, out));
};

export default {
    Debug,
    $,
};
