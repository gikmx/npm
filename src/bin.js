#!/usr/bin/env node
import 'source-map-support/register';
import PATH from 'path';
import { $ } from '@gik/tools-streamer';
import Out from './out';

/**
 * @namespace gik-npm
 * @description Centralizes and automates the management of projects based on ECMAScript.
 *
 * [create-react-app](https://github.com/facebookincubator/create-react-app) inspired us
 * to build this tool, it made our life way easier and so we decided to apply the same
 * principle to our workflow: A single place where to put all the configuration and
 * automation for our projects in ECMAScript (meaning Node, Cycle, Webpack, React, etc.)
 *
 * ###### Installation
 * Nothing special, just like every other tool in your arsenal, install as development
 * dependency and you're good to go.
 *
 * ```bash
 * npm install --save-dev @gik/npm
 * ```
 * ###### Setup
 * Just add a reference to the "binary" `gik-npm` and pass the needed arguments according
 * to the task you wish to execute.
 *
 * @param {string} script - One of the [Scripts](#gik-npm.Scripts) available.
 * @param {...string} [param] - Each script has it own set of optional arguments, check
 * [their section](#gik-npm.Scripts) for more information.
 *
 * @example @lang js <caption>package.json</caption>
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
    .mergeMap(({ args, pwd }) => {
        const script = args.shift();
        const path = PATH.join(pwd, script + PATH.extname(__filename));
        return $
            .fromStat(path)
            .catch(() => $.of(false))
            .switchMap(function scriptStat(stat) {
                if (!stat || !stat.isFile()) throw new Error(`Invalid script "${script}"`);
                const observable = require(path).default(...args);
                Out.warn(`Running "${script}(${args.join(',')})"`);
                return observable;
            });
    })
    .map(({ status, message }) => {
        if (status === 1) throw new Error(message);
        return message;
    })
    // actually run the program.
    .subscribe(Out.warn, Out.error, () => Out.good('Done.'));

/**
 * @namespace Scripts
 * @memberof gik-npm
 * @description The tasks available to run against your project.
 *
 * @todo Add typedef for error codes and Observables.
 */
