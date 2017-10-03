import PATH from 'path';
import Npm from 'npm';
import Git from 'nodegit';
import Out from '../out';
import { $ } from '../tools';

const CWD = process.cwd();

/**
 * Automates the versioning of your packages using **semver**.
 */
export default function Version(type = 'patch') {

    const $fromIndexAdd = (index, file) => $
        .fromAccess(PATH.join(CWD, file))
        .switchMap(access => access ?
            $.from(index.addByPath(file)).mapTo(index) :
            $.of(index),
        );

    // Checks if there are files on stage when running. (to assume a precommit)
    const gitCheck$ = $
        .from(Git.Repository.open(CWD))
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
    return gitCheck$
        .isEmpty()
        .switchMap(empty => empty ? version$ : version$.switchMapTo(gitStage$))
        .subscribe(Out.good, Out.error);
}
