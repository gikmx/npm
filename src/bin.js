#!/usr/bin/env node

import PATH from 'path';
import Out from './out';
import { $ } from './tools';

/**
 * The binary that controls which script is going to be run.
 * @module gik-npm
 * @param {string} script - The script you wish to run. It accepts an optional parameter
 *                          by using a colon after the script name. Each script has    -
 *                          differents sub parameters defined.
 * @example <caption>`package.json`</caption>
 * {
 *     "scripts": {
 *         "build": "gik-npm build",
 *         "ver": "gik-npm version:patch",
 *     }
 * }
 */
$
    // Remove unneeded arguments and statr a stream from reminders.
    .from(process.argv.slice(2))
    .map(command => ({
        command,
        pwd: PATH.resolve(PATH.join(__dirname, 'scripts')),
    }))
    // Determine if the given script exists and requires it. Throws error if it doesn't.
    .mergeMap(function determineAccess({ command, pwd }) {
        let script = command;
        let args = [];
        if (script.indexOf(':') !== -1) {
            args = script.split(':');
            script = args.shift();
        }
        const path = PATH.join(pwd, script + PATH.extname(__filename));
        return $
            .fromStat(path)
            .catch(() => $.of(false))
            .map(function scriptStat(stat) {
                if (!stat || !stat.isFile()) throw new Error(`Invalid script "${script}"`);
                return require(path).default(...args);
            })
            .mapTo(`Running "${command}"`);
    })
    .subscribe(Out.warn, Out.error);

/**
 * @namespace Scripts
 */
