#!/usr/bin/env node

import PATH from 'path';
import Out from './out';
import { $ } from './tools';

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
