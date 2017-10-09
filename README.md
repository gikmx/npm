# [@gik/npm](https://github.com/gikmx/npm) *0.0.21*
> GIK's take on NPM scripts.

## Contributors
* [Héctor Menéndez](mailto:hector@gik.mx) []()

# Usage

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [gik-npm](#gik-npm)
-   [Scripts](#scripts)
    -   [Build](#build)
    -   [Docs](#docs)
    -   [Lint](#lint)
    -   [Version](#version)
-   [Configuration](#configuration)

## gik-npm

The binary that controls which script is going to be run.

**Parameters**

-   `script` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The script you wish to run. It accepts an optional parameter
                             by using a colon after the script name. Each script has    -
                             differents sub parameters defined.

**Examples**

_`package.json`_

```javascript
{
    "scripts": {
        "build": "gik-npm build",
        "ver": "gik-npm version:patch",
    }
}
```

## Scripts

These are the scripts that are available to use:

### Build

Transpiles your project using **babel**.

### Docs

Generates documentation using **documentation.js**.

**Parameters**

-   `task` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** subtask to run: currently only "lint" is available (optional, default `null`)

### Lint

Validates the code complies with certain rules.
It's recommended that you install one of the flavours of
[eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
it will be as easy as to include an `.eslintrc` file extending the module.

**Parameters**

-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The target directory to lint (src by default), (optional, default `'src'`)

**Examples**

_`package.json`_

```javascript
{
    "directories": {
        "example": './example'
    },
    "scripts": {
        "lint": "gik-npm lint:example"
    },
    "devDependencies": {
         "@gik/eslint-config-node": "x.x.x" // Pick a flavour according to your project
    }
}
```

_`.eslintrc`_

```javascript
{
    "extends": "@gik/node" // Same as the module but without "eslint-config"
}
```

### Version

Automates the versioning of your packages using **semver**.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** One of the valid **semver** versions. (optional, default `"patch"`)

## Configuration

The default settings that control the behaviour of the scripts.

**Properties**

-   `directories` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Lets NPM know where are some directories.
        This has the added benefit of letting you use this assign environment variables
        Either on your project or in their scripts object.
    -   `directories.src` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path for the source files.
    -   `directories.out` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path for the transpiled files.
    -   `directories.test` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path for the test files.
-   `gik_npm` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The container for the script-specific options. <br>
        **NOTE** the key for this options is `@gik/npm` but it cannot be used on the
                 documentation due to limitiations on the generator.
    -   `gik_npm.doc` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path where generated docs will be placed.
    -   `gik_npm.babel` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options for the babel transpiler.
        -   `gik_npm.babel.ast` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include AST outout on builds.
        -   `gik_npm.babel.babelrc` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Read .babelrc found in context?
        -   `gik_npm.babel.comments` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include comments ?
        -   `gik_npm.babel.compact` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Remove unneeded spaces ?
        -   `gik_npm.babel.minified` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Minify the number of characters ?
        -   `gik_npm.babel.sourceMaps` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include sourcemaps ?
        -   `gik_npm.babel.extends` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The base .babelrc to extend from.
    -   `gik_npm.documentation` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options for the documentation generator.
        -   `gik_npm.documentation.template` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The location of documentation template.

**Examples**

_`package.json`_

```javascript
{
    "directories": {
         "src": "./src",
         "out": "./lib",
         "test": "./test",
     },
    "scripts": {
         "example": "your-script $npm_package_directories_src"
     },
    "@gik/npm": {
        "doc": "./README.md"
    },
}
```
