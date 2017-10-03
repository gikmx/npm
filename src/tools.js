import PATH from 'path';
import FS from 'fs';
import { inspect as INSPECT } from 'util';
import Shell from 'shelljs';
import Chalk from 'chalk';
import Logger from 'debug';
import { Observable } from 'rxjs';
import Package from '../package.json';

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


export const $ = Observable;

$.fromAccess = function $fromAccess(path) {
    debug('$fromAccess:ini', path);
    return $.bindNodeCallback(FS.access)(path)
        .mapTo(path)
        .catch(() => $.of(false))
        .do(() => debug('$fromAccess:end', path));
};

$.fromStat = function $fromStat(path) {
    debug('$fromStat:ini', path);
    return $.bindNodeCallback(FS.stat)(path)
        .do(stat => debug('$fromStat:end', path, stat));
};

$.fromShell = function $fromShell(command) {
    debug('$fromShell:ini', command);
    const args = command.split(/\s/g);
    const cmd = args.shift().toLowerCase();
    let cmd$;
    switch (cmd) {
    case 'exec':
        cmd$ = $.bindNodeCallback(Shell[cmd])(args.join(' '));
        break;
    // sync commands
    default:
        cmd$ = $.of(Shell[cmd](...args)).mapTo(true);
    }
    return cmd$.do(stdout => debug('$fromShell:end', command, stdout));
};

$.fromDirMake = function $fromDirMake(path) {
    debug('$fromDirMake', path, 'ini');
    return $.bindNodeCallback(FS.mkdir)(path)
        .mapTo(path)
        .do(() => debug('$fromDirMake', path, 'end'));
};

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

$.fromDirRead = function $fromDirRead(path) {
    debug('$fromDirRead:ini', path);
    return $.bindNodeCallback(FS.readdir)(path)
        .do(nodes => debug('fromDirRead:end', path, nodes))
        .concatMap(nodes => $.from(nodes))
        .map(node => PATH.join(path, node))
        .mergeMap(npath => $.fromStat(npath).map(stat => ({ stat, path: npath })));
};

$.fromDirReadRecursive = function $fromDirReadRecursive(path) {
    return $
        .fromDirRead(path)
        .mergeMap(node => !node.stat.isDirectory() ?
            $.of(node) :
            $.fromDirReadRecursive(node.path),
        );
};

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
 * @param {string} path - The full path for the file.
 * @param {string} content - The contents of the file.
 * @return {Observable:boolean} - The future value `true` if write was succesful.
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
