import PATH from 'path';
import Git from 'nodegit';
import Out from '../out';
import Config from '../config';
import { $ } from '../tools';

const CWD = process.cwd();
const Path = {};
Path.root = PATH.resolve(__dirname, '..', '..');
Path.node_modules = PATH.join(Path.root, 'node_modules');
Path.bin = PATH.join(Path.node_modules, '.bin');

/**
 * Generates documentation using `jsdoc-to-markdown`.
 */
export default function Docs() {
    const config = Config[Config.name];
    const jsdoc2md = [
        'npm --prefix ', Path.root,
        'run command:jsdoc2md -s --',
        '--files', PATH.join(PATH.resolve(config.src), config.jsdoc2md.glob),
        '--configure', PATH.join(Path.root, '.jsdoc'),
        '--template', config.jsdoc2md.template,
        '--heading-depth', config.jsdoc2md['heading-depth'],
        '--example-lang', config.jsdoc2md['example-lang'],
        '--module-index-format', config.jsdoc2md['module-index-format'],
        '--global-index-format', config.jsdoc2md['global-index-format'],
        '--member-index-format', config.jsdoc2md['member-index-format'],
        '--param-list-format', config.jsdoc2md['param-list-format'],
        '--property-list-format', config.jsdoc2md['property-list-format'],
        '>', PATH.resolve(config.doc),
    ].join(' ');

    const doc$ = $
        .fromShell(`exec ${jsdoc2md}`)
        .mapTo(`Documentation generated on ${config.doc}`);

    const docAdd$ = doc$
        .switchMapTo($.from(Git.Repository.open(CWD)))
        .switchMap(repo => $.from(repo.index()))
        .switchMap(index => $
            .from(index.addByPath(PATH.normalize(config.doc)))
            .mapTo(index),
        )
        .switchMap(index => $.from(index.write()))
        .mapTo(`Documentation generated on ${config.doc} and added to Git stage.`);

    return $
        .fromAccess(PATH.resolve(config.doc))
        .switchMap(access => access ? docAdd$ : doc$)
        .subscribe(Out.good, Out.error);
}
