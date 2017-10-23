import PATH from 'path';
import FS from 'fs';
import DeepMerge from 'deepmerge';
import ReadPackage from 'read-package-json';
import { $ } from '@gik/tools-streamer';
import Package from '../package.json';
import Path from './path';
import { Debug } from './tools';

const debug = Debug([
    Package.name,
    PATH.basename(__filename, PATH.extname(__filename)),
].join(':'));

/**
 * @module Configuration
 * @memberof gik-npm
 * @description
 * The default settings that control the behaviour of the scripts.
 *
 * @property {Object} directories - Lets NPM know where are some directories.
 * This has the added benefit of letting you use this assign environment variables
 * Either on your project or in their scripts object.
 * @property {string} [directories.src=./src] - The path for the source files.
 * @property {string} [directories.out=./lib] - The path for the transpiled files.
 * @property {string} [directories.test=./test] - The path for the test files.
 * @property {string} [directories.template=./template] - The path for the template files.
 * @property {Object} @gik/npm - The container for the script-specific options. Check
 * [their section](#gik-npm.Scripts) for more information.
 *
 * @example @lang js <caption>package.json</caption>
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
        template: './template',
    },
    [Package.name]: {
        babel: {
            ast: true,
            babelrc: true,
            code: true,
            comments: false,
            compact: false,
            minified: false,
            sourceMaps: 'inline',
            extends: PATH.join(Path.root, '.babelrc'),
        },
        jsdoc: {
            configure: PATH.join(Path.root, '.jsdocrc'),
            template: PATH.join(Path.jsdoc, 'README.hbs'),
            helper: FS.readdirSync(Path.src)
                .filter(file => PATH.extname(file) === '.js')
                .filter(file => PATH.basename(file).indexOf('jsdoc-helper') === 0)
                .map(file => PATH.join(Path.src, file)),
            partial: FS.readdirSync(Path.jsdoc)
                .filter(file => PATH.extname(file) === '.hbs')
                .filter(file => PATH.basename(file).indexOf('partial-') === 0)
                .map(file => PATH.join(Path.jsdoc, file)),

            plugin: [],
            private: false,
            separators: false,
            'heading-depth': 2,
            'example-lang': 'none',
            'name-format': true,
            'no-gfm': false,
            'module-index-format': 'grouped',
            'global-index-format': 'dl',
            'param-list-format': 'table',
            'member-index-format': 'list',
            'no-cache': true,
        },
    },
};

/**
 * @typedef {Object} Package
 * @memberof gik-npm.Configuration
 * @description The contents of `gik-npm`'s  `package.json`.
 * @private
 */
export { Package };

/**
 * A parsed version of package.json.
 * @memberof gik-npm.Configuration
 * @return {Observable} - Resolves to an object containing the parsed package.json.
 * @private
 */
export function $fromConfig() {
    const path = PATH.join(Path.cwd, 'package.json');
    debug('$fromConfig:ini', path);
    const log = debug.bind(debug, '$fromConfig:end');
    return $
        .bindNodeCallback(ReadPackage)(path, log, false)
        .map(config => DeepMerge(Defaults, config));
}

export default {
    Defaults,
    Package,
    $fromConfig,
};
