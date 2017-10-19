#!/usr/bin/env node

import PATH from 'path';
import Out from './out';
import { $ } from './tools';

/**
 * The binary that controls which script is going to be run.
 * @module gik-npm
 * @param {string} script - The script you wish to run. It accepts an optional parameters,
 * just send them separated by spaces.
 *
 * @example <caption>`package.json`</caption>
 * {
 *     "scripts": {
 *         "build": "gik-npm build",
 *         "ver": "gik-npm version patch",
 *     }
 * }
 */
$
    // Remove unneeded arguments and statr a stream from reminders.
    .of({
        args: process.argv.slice(2),
        pwd: PATH.resolve(PATH.join(__dirname, 'scripts')),
    })
    // Determine if the given script exists and requires it. Throws error if it doesn't.
    .mergeMap(function determineAccess({ args, pwd }) {
        const script = args.shift();
        const path = PATH.join(pwd, script + PATH.extname(__filename));
        return $
            .fromStat(path)
            .catch(() => $.of(false))
            .map(function scriptStat(stat) {
                if (!stat || !stat.isFile()) throw new Error(`Invalid script "${script}"`);
                return require(path).default(...args);
            })
            .mapTo(`Running "${script}(${args.join(',')})"`);
    })
    .subscribe(Out.warn, Out.error);

/**
 * @namespace Scripts
 */
