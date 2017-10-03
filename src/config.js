/**
 * Configuration tools
 * @module Config
 * @memberof Tools
 */

import PATH from 'path';
import ReadPackage from 'read-package-json'; // part of npm
import Path from './path';
import { $, Debug } from './tools';

/**
 * The default settings that control the behaviour of the scripts.
 * @memberof gik-npm
 * @alias Configuration
 * @property {string} [src="./src"] - The path where the source files are located.
 * @property {string} [out="./lib"] - The path where the transpiled files will be placed.
 * @property {string} [doc="./README.md"] - The path for the generated docs will be placed.
 * @property {Object.<boolean,string>} babel - Options for the babel transpiler.
 * @property {Boolean} [babel.ast=false] - Include AST outout on builds.
 * @property {Boolean} [babel.babelrc=true] - Read .babelrc found in context?
 * @property {Boolean} [babel.comments=false] - Include comments ?
 * @property {Boolean} [babel.compact=false] - Remove unneeded spaces ?
 * @property {Boolean} [babel.minified=true] - Minify the number of characters ?
 * @property {Boolean} [babel.sourceMaps=true] - Include sourcemaps ?
 * @property {string} [babel.extends] - The base .babelrc to extend from.
 * @property {Object.<string>} documentation - Options for the documentation generator.
 * @property {string} [template] - The location of documentation template.
 * @property {string} [section] - The section to put API documentation on.
 * @property {string} [target] - A glob determining which files to include on src folder.
 * @example <caption>If you want to override tis config, do so in `package.json`</caption>
 * {
 *     "@gik/npm": {
 *         "src": "./source",
 *         "out": "./dist"
 *     },
 * }
 */
export const Defaults = {
    src: './src',
    out: './lib',
    doc: './README.md',
    babel: {
        ast: false,
        babelrc: true,
        code: true,
        comments: false,
        compact: true,
        minified: true,
        sourceMaps: true,
        extends: PATH.join(Path.root, '.babelrc'),
    },
    documentation: {
        template: PATH.join(Path.template, 'README.md'),
        section: 'Usage',
        target: '**',
    },
};

/**
 * The method in charge of merging package.json with the defaults.
 * @private
 * @return {Object} - The extended package.json
 */
const extend = config => ({
    ...config,
    [config.name]: Object.assign({}, Defaults, config[config.name] || {}),
});

/**
 * The raw version of the package.json.
 * @memberof Tools.Config
 * @type {Object}
 */
export const Package = extend(require(PATH.join(Path.cwd, 'package.json')));

/**
 * Enables the debugger for this instance.
 * @private
 * @type {function}
 */
const debug = Debug([
    Package.name,
    PATH.basename(__filename, PATH.extname(__filename)),
].join(':'));

/**
 * A parsed version of package.json.
 * @memberof Tools.Config
 * @return {Observable} - Resolves to an object containing the parsed package.json.
 */
export default function $fromConfig() {
    const path = PATH.join(Path.cwd, 'package.json');
    debug('$fromConfig:ini', path);
    return $
        .bindNodeCallback(ReadPackage)(
            path, // load this file
            debug.bind(debug, '$fromConfig:end'), // use this function to output log
            false, // disable strict validation
        )
        .map(config => extend(config));
}
