import PATH from 'path';

const CWD = process.cwd();
const Package = require(PATH.join(CWD, 'package.json'));

export default Object.assign({
    src: './src',
    out: './lib',
    babel: {
        ast: false, // Include the AST on the build
        babelrc: true, // wether to use babelrc files
        code: true, // Wether to include the generated con on the build
        comments: false, // Should comments be included on the build?
        compact: true, // Remove unneeded spaces
        minified: true,
        sourceMaps: true,
        extends: PATH.resolve(PATH.join(__dirname, '..', '.babelrc')),
    },
}, Package['@gik/npm'] || {});
