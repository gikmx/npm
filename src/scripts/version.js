import PATH from 'path';

import Npm from 'npm';
import Git from 'nodegit';
import { $ } from '@gik/tools-streamer';

import Path from '../path';

/**
 * @module version
 * @memberof gik-npm.Scripts
 * @description Automates the versioning of your project using **semver**.
 * internally uses `npm version` (avoiding tagging) and after modifying `package.json`
 * adds it to git. This is specially useful if you add it to a `precommit` script
 * (already available when using this library via [husky](https://github.com/typicode/husky)),
 * making the change available on that commit automatically.
 *
 * ###### Available semver types:
 * - **major** `0.0.0 -> 1.0.0`
 * - **minor** `0.0.0 -> 0.1.0`
 * - **patch** `0.0.0 -> 0.0.1`
 * - **prerelease**
 *   - `0.0.0 -> 0.0.0-1`
 *   - `0.0.0-beta -> v0.0.0-beta.0`
 *   - `0.0.0-beta.0 -> 0.0.0-beta.1`
 *
 * @param {string} [type=patch] - One of the valid semver version names.
 * @param {string} [extra=null] - Extra options. currently only "--no-add" available.
 *
 * @returns {gik-npm.Types.Observable} - An observable which `gik-npm` will subscribe to
 * in order to execute it.
 *
 * @example @lang js <caption>packge.json</caption>
 * {
 *     "scripts": {
 *         // builds, bumps package.json and generartes docs using the new version
 *         "precommit": "gik-npm build && gik-npm version patch && git-npm docs"
 *     }
 * }
 */
export default function $fromScriptVersion(type = 'patch', extra = null) {

    const CWD = Path.cwd;

    const $fromIndexAdd = (index, file) => $
        .fromAccess(PATH.join(CWD, file))
        .switchMap(access => access
            ? $.from(index.addByPath(file)).mapTo(index)
            : $.of(index),
        );

    // Checks if there are files on stage when running. (to assume a precommit)
    const gitCheck$ = $
        .from(Git.Repository.openExt(CWD, 0, '/'))
        .switchMap(repo => $
            // gets array of file status
            .from(repo.getStatus())
            // inspect each file status individually
            .concatAll()
            .map(file => file.status())
            // If the file has not been staged, is filtered out
            .filter(sts => sts.filter(st => st.indexOf('INDEX_') === 0).length)
            // Either return the repo with staged changes, or nothing.
            .map(statuses => statuses.length ? repo : null),
        )
        // Won't emit if no changes are staged.
        .filter(Boolean);

    // Bump the version according to specified type.
    const version$ = $
        .bindNodeCallback(Npm.load)({
            _exit: true, // Forces NPM to behave programatically
            'git-tag-version': false, // Don't create a tag for this.
        })
        .switchMap(npm => $.bindNodeCallback(npm.commands.version)([type]))
        .mapTo('Versioned.');

    // If user is preparing to commit, add changes to stage.
    const gitStage$ = $
        .from(Git.Repository.open(CWD))
        // Refresh the index and add the bumped files.
        .switchMap(repo => $
            .from(repo.index())
            .switchMap(index => $fromIndexAdd(index, 'package.json'))
            .switchMap(index => $fromIndexAdd(index, 'package-lock.json'))
            .switchMap(index => $fromIndexAdd(index, 'yarn.lock'))
            .switchMap(index => $.from(index.write()))
            .mapTo(repo),
        )
        .mapTo('Versioned and added change to Git stage.');

    // If no files are in stage, just version, add to stage too otherwise.
    const versionAndAdd$ = gitCheck$
        .isEmpty()
        .switchMap(empty => empty ? version$ : version$.switchMapTo(gitStage$));

    const operation$ = extra === '--no-add' ? version$ : versionAndAdd$;
    return operation$.map(message => ({ status: 0, message }));
}
