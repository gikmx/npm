import PATH from 'path';
import { transformFile as Babel } from 'babel-core';
import { $ } from '../tools';
import Out from '../out';

const CWD = process.cwd();
const Package = require(PATH.join(CWD, 'package.json'));

process.env.NODE_ENV = 'production';

const config = Object.assign({
    babel: {
        ast: false, // Include the AST on the build
        babelrc: true, // wether to use babelrc files
        code: true, // Wether to include the generated con on the build
        comments: false, // Should comments be included on the build?
        compact: true, // Remove unneeded spaces
        minified: true,
        sourceMaps: true,
    },
    build: {
        src: './src',
        out: './lib',
    },
}, Package['@gik/npm'] || {});

const src$ = $
    .fromDirRequire(config.build.src)
    .mergeMap(dir => $.fromDirReadRecursive(dir))
    .map(node => node.path)
    .mergeMap(path => $.bindNodeCallback(Babel)(path, config.babel)
        .map(({ code, map }) => ({ path, code, map: map.mappings })),
    );

const lib$ = $
    .of(config.build.out)
    .defaultIfEmpty([])
    // Determine if Dir exists, and if it doesn't create it
    .switchMap(path => $.fromDirRequire(path))
    // List directory contents and delete'em.
    .mergeMap(path => $.fromDirRead(path))
    .mergeMap(node => $.fromShell(`rm -Rf ${node.path}`))
    // Makes sure the deletion finishes
    .toArray();

lib$
    .concatMapTo(src$)
    .mergeMap(function writeMap({ code, path, map }) {
        path = path.replace(
            PATH.resolve(config.build.src),
            PATH.resolve(config.build.out),
        );
        return $
            .fromShell(`mkdir -p ${PATH.dirname(path)}`)
            .concatMapTo([
                { path, content: code || '' },
                { path: `${path}.map`, content: map || '' },
            ])
            .mergeMap(({ path, content }) => $
                .fromFileWrite(path, content)
                .mapTo(path.replace(process.cwd(), '.'))
                .filter(path => !path.match(/\.map$/)),
            );
    })
    .subscribe(
        Out.info,
        Out.error,
        () => Out.good('Built.'),
    );
