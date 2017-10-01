#!/usr/bin/env node

import PATH from 'path';
import FS from 'fs';
import { Observable as $ } from 'rxjs';
import Out from '../lib/out';

$
    // Remove unneeded arguments and statr a stream from reminders.
    .from(process.argv.slice(2))
    .map(command => ({
        command,
        pwd: PATH.resolve(PATH.join(__dirname, 'scripts')),
    }))
    // Determine if the given script exists and requires it. Throws error if it doesn't.
    .mergeMap(function determineAccess({ command, pwd }) {
        const path = PATH.join(pwd, command + PATH.extname(__filename));
        return $.bindNodeCallback(FS.access)(path)
            .catch(function catchAccessError() {
                throw new Error(`Invalid command "${command}"`);
            })
            .map(() => require(`${path}`))
            .mapTo(`Running "${command}"`);
    })
    .subscribe(Out.warn, Out.error);
