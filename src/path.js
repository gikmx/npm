import PATH from 'path';

const Path = {};
export default Path;

Path.cwd = process.cwd();

Path.root = PATH.resolve(__dirname, '..');

Path.template = PATH.join(Path.root, 'template');

Path.node_modules = PATH.join(Path.root, 'node_modules');

Path.bin = PATH.join(Path.node_modules, '.bin');
