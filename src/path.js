import PATH from 'path';

const Path = {};
export default Path;

Path.cwd = process.cwd();
Path.src = __dirname;
Path.root = PATH.resolve(Path.src, '..');
Path.template = PATH.join(Path.root, 'template');
Path.node_modules = PATH.join(Path.root, 'node_modules');
Path.bin = PATH.join(Path.node_modules, '.bin');
Path.etc = PATH.join(Path.root, 'etc');
Path.jsdoc = PATH.join(Path.etc, 'jsdoc');
