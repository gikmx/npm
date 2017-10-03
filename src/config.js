import PATH from 'path';

const CWD = process.cwd();
const Package = require(PATH.join(CWD, 'package.json'));

const root = PATH.resolve(PATH.join(__dirname, '..'));

export default {
    ...Package,
    [Package.name]: Object.assign({
        src: './src',
        out: './lib',
        doc: './README.md',
        babel: {
            ast: false, // Include the AST on the build
            babelrc: true, // wether to use babelrc files
            code: true, // Wether to include the generated con on the build
            comments: false, // Should comments be included on the build?
            compact: true, // Remove unneeded spaces
            minified: true,
            sourceMaps: true,
            extends: PATH.join(root, '.babelrc'),
        },
        jsdoc2md: {
            template: PATH.join(root, 'README.hbs'),
            glob: PATH.join('**', '*.js'),
            conf: PATH.join(root, '.jsdoc'),
            'heading-depth': '1',
            'example-lang': 'js',
            'module-index-format': 'table',
            'global-index-format': 'table',
            'member-index-format': 'list',
            'param-list-format': 'table',
            'property-list-format': 'table',
        },
    }, Package[Package.name] || {}),
};
