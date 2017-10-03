import PATH from 'path';
import ReadPackage from 'read-package-json'; // part of npm
import PlainPackage from '../package.json';
import Path from './path';
import { $, Debug } from './tools';

/**
 * The default configuration to be exposed on package.json
 */
export const Defaults = {
    src: './src',
    out: './lib',
    doc: './README.md',
    babel: {
        ast: false, // Include the AST on the build
        babelrc: true, // wether to use babelrc fiiiles
        code: true, // Wether to include the generated con on the build
        comments: false, // Should comments be included on the build?
        compact: true, // Remove unneeded spaces
        minified: true,
        sourceMaps: true,
        extends: PATH.join(Path.root, '.babelrc'),
    },
    documentation: {
        template: PATH.join(Path.template, 'README.md'),
        section: 'API',
        target: PATH.join('**', '*.js'),
    },
};

/**
 * The method in charge of merging package.json with the defaults.
 * @private
 * @return {object} - The extended package.json
 */
const extend = config => ({
    ...config,
    [config.name]: Object.assign({}, Defaults, config[config.name] || {}),
});

/**
 * The non-parsed version of the configuration.
 */
export const Package = extend(PlainPackage);

/**
 * Enables the debugger for this instance.
 * @private
 */
const debug = Debug([
    Package.name,
    PATH.basename(__filename, PATH.extname(__filename)),
].join(':'));


/**
 * A parsed version of package.json.
 * @return {Observable:object} - Resolves to an object containing the parsed package.json.
 */
export default function $fromConfig() {
    const path = PATH.join(Path.root, 'package.json');
    debug('$fromConfig:ini', path);
    return $
        .bindNodeCallback(ReadPackage)(
            path, // load this file
            debug.bind(debug, '$fromConfig:end'), // use this function to output log
            false, // disable strict validation
        )
        .map(config => extend(config));
}
