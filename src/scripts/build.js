// Native
import PATH from 'path';
// NPM
import { transformFile as Transpile } from 'babel-core';
import { $, Subject } from '@gik/tools-streamer';
import RimRaf from 'rimraf';
import MkDirP from 'mkdirp';
// Local
import { $fromConfig, Package } from '../config';

process.env.NODE_ENV = 'production';

/**
 * @module build
 * @memberof gik-npm.Scripts
 * @description Transpiles the current project using **babel**.
 *
 * ###### Base (.babelrc)`
 * ```javascript
 * <<<file:root/.babelrc>>>
 * ```
 * The following `package.json` properties are available to you in case you wish to modify
 * the default behaviour.
 *
 * @property {Object} babel - Options for the babel transpiler.
 * @property {boolean} [babel.babelrc=true] - Read .babelrc found in context?
 * @property {boolean} [babel.comments=false] - Include comments?
 * @property {boolean} [babel.compact=false] - Remove unneeded spaces?
 * @property {boolean} [babel.minified=true] - Minify the number of characters?
 * @property {boolean} [babel.sourceMaps=inline] - Whether to include sourcemaps or not.
 * `true` would output the sourcemap as external file. `false` omits it, and `"inline"`
 *  puts the contents of the sourcemaps on the same file as the code.
 * @property {string} [babel.extends] - The base .babelrc to extend from. The base file is
 * shown below. but your can specify your own path. Remember that if you put a file on
 * your own folder, it would be taked into account. granted the `babel.babelrc` property
 * is set to `true`.
 *
 * @returns {gik-npm.Types.Observable} - An observable which `gik-npm` will subscribe to
 * in order to execute it.
 */
export default function $fromScriptBuild() {

    // Converts the config$ into a hot observable, so it only runs once.
    const subject = new Subject();
    $fromConfig().subscribe(subject);
    const config$ = new $(observer => subject.subscribe(observer));

    const cleanup$ = config$
        .map(config => config.directories.out)
        .defaultIfEmpty([])
        // Determine if Dir exists, and if it doesn't create it
        .switchMap(path => $.fromDirRequire(path))
        // List directory contents and delete'em.
        .mergeMap(path => $.fromDirRead(path))
        .mergeMap(node => $.bindNodeCallback(RimRaf)(node.path))
        // Makes sure the deletion finishes
        .toArray();

    return $
        .combineLatest(cleanup$, config$)
        .map(([, config]) => config)
        .switchMap(config => $
            .fromDirRequire(config.directories.src)
            .mergeMap(dir => $.fromDirReadRecursive(dir))
            .map(node => node.path)
            .filter(path => PATH.extname(path) === PATH.extname(__filename))
            .mergeMap(path => $
                .bindNodeCallback(Transpile)(path, config[Package.name].babel)
                .map(({ code, map }) => ({
                    config,
                    path,
                    code,
                    map: map ? map.mappings : null,
                })),
            ),
        )
        .concatMap(({ config, path, code, map }) => { // eslint-disable-line
            const dest = path.replace(
                PATH.resolve(config.directories.src),
                PATH.resolve(config.directories.out),
            );
            return $
                .bindNodeCallback(MkDirP)(PATH.dirname(dest))
                .concatMapTo([
                    { path: dest, content: code || '' },
                    !map ? null : { path: `${dest}.map`, content: map },
                ]);
        })
        .filter(Boolean)
        .concatMap(({ path, content }) => $
            .fromFileWrite(path, content)
            .mapTo(path.replace(process.cwd(), '.')),
        )
        .filter(p => !p.match(/\.map$/))
        .map(path => ({
            status: 0,
            message: path,
        }));
}
