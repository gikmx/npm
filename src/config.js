import PATH from 'path';
import DeepMerge from 'deepmerge';
import ReadPackage from 'read-package-json';
import Package from '../package.json';
import Path from './path';
import { $, Debug } from './tools';

/**
 * The default settings that control the behaviour of the scripts.
 * @namespace Configuration
 *
 * @property {Object} directories - Lets NPM know where are some directories.
 *     This has the added benefit of letting you use this assign environment variables
 *     Either on your project or in their scripts object.
 * @property {string} [directories.src="./src"] - The path for the source files.
 * @property {string} [directories.out="./lib"] - The path for the transpiled files.
 * @property {string} [directories.test="./test"] - The path for the test files.
 * @property {Object} gik_npm - The container for the script-specific options. <br>
 *     **NOTE** the key for this options is `@gik/npm` but it cannot be used on the
 *              documentation due to limitiations on the generator.
 * @property {string} [gik_npm.doc="./README.md"] - The path where generated docs will be placed.
 *
 * @property {Object} gik_npm.babel - Options for the babel transpiler.
 * @property {Boolean} [gik_npm.babel.ast=false] - Include AST outout on builds.
 * @property {Boolean} [gik_npm.babel.babelrc=true] - Read .babelrc found in context?
 * @property {Boolean} [gik_npm.babel.comments=false] - Include comments ?
 * @property {Boolean} [gik_npm.babel.compact=false] - Remove unneeded spaces ?
 * @property {Boolean} [gik_npm.babel.minified=true] - Minify the number of characters ?
 * @property {Boolean} [gik_npm.babel.sourceMaps=true] - Include sourcemaps ?
 * @property {string} [gik_npm.babel.extends] - The base .babelrc to extend from.
 *
 * @property {Object} gik_npm.documentation - Options for the documentation generator.
 * @property {string} [gik_npm.documentation.template] - The location of documentation template.
 *
 * @example <caption>`package.json`</caption>
 * {
 *     "directories": {
 *          "src": "./src",
 *          "out": "./lib",
 *          "test": "./test",
 *      },
 *     "scripts": {
 *          "example": "your-script $npm_package_directories_src"
 *      },
 *     "@gik/npm": {
 *         "doc": "./README.md"
 *     },
 * }
 */
export const Defaults = {
    directories: {
        src: './src',
        out: './lib',
        test: './test',
    },
    [Package.name]: {
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
    },
};


/**
 * The Configuration utilities.
 * @module Config
 * @memberof Tools
 */
/**
 * The raw version of the host package.json.
 * @memberof Tools.Config
 * @type {Object}
 */
export { Package };

/**
 * The raw version of the package.json.
 * @memberof Tools.Config
 * @type {Object}
 */
export const Config = DeepMerge(Defaults, require(PATH.join(Path.cwd, 'package.json')));


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
export function $fromConfig() {
    const path = PATH.join(Path.cwd, 'package.json');
    debug('$fromConfig:ini', path);
    return $
        .bindNodeCallback(ReadPackage)(
            path, // load this file
            debug.bind(debug, '$fromConfig:end'), // use this function to output log
            false, // disable strict validation
        )
        .map(config => DeepMerge(Defaults, config));
}

export default {
    Defaults,
    Package,
    Config,
    $fromConfig,
};
