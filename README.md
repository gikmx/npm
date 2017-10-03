# [@gik/npm](https://github.com/gikmx/npm) _0.0.15-3_

> GIK's take on NPM scripts.

## Contributors

    * [Héctor Menéndez](hector@gik.mx) <>

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### gik-npm

The binary that controls which script is going to be run.

**Parameters**

-   `script` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The script you wish to run. It accepts an optional parameter
                             by using a colon after the script name. Each script has    -
                             differents sub parameters defined.

**Examples**

_this is supposed to be a_

```javascript
{
    ...
    "scripts": {
        "build": "gik-npm build",
        "ver": "gik-npm version:patch",
    }
}
```

#### Configuration

The default settings that control the behaviour of the scripts.

**Properties**

-   `src` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path where the source files are located.
-   `out` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path where the transpiled files will be placed.
-   `doc` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The path for the generated docs will be placed.
-   `babel` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Options for the babel transpiler.
    -   `babel.ast` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include AST outout on builds.
    -   `babel.babelrc` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Read .babelrc found in context?
    -   `babel.comments` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include comments ?
    -   `babel.compact` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Remove unneeded spaces ?
    -   `babel.minified` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Minify the number of characters ?
    -   `babel.sourceMaps` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Include sourcemaps ?
    -   `babel.extends` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The base .babelrc to extend from.
-   `documentation` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** Options for the documentation generator.
-   `template` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The location of documentation template.
-   `section` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** The section to put API documentation on.
-   `target` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** A glob determining which files to include on src folder.

**Examples**

_If you want to override tis config, do so in `package.json`_

```javascript
{
    "@gik/npm": {
        "src": "./source",
        "out": "./dist"
    },
}
```

### Scripts

These are the scripts that are available to use:

#### Build

Transpiles your project using **babel**.

#### Docs

Generates documentation using `documentation.js`.

#### Version

Automates the versioning of your packages using **semver**.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** One of the valid **semver** versions. (optional, default `"patch"`)

### Tools

#### Config

Configuration tools

##### Package

The raw version of the package.json.

##### $fromConfig

A parsed version of package.json.

Returns **[Observable](#observable)** Resolves to an object containing the parsed package.json.

#### Debug

-   **See: <https://github.com/visionmedia/debug>**

Makes debugging a little bit prettier.

**Parameters**

-   `context` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** An identifier to pass on to debug.

#### $

RXjs Observables.

##### fromAccess

Determine if given path is accessible.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A path to the node you want to check.

Returns **[Observable](#observable)&lt;[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** Wether the file is accessible or not.

##### fromStat

-   **See: <https://nodejs.org/api/fs.html#fs_class_fs_stats>**

Determine statistics about a file system node.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A path to the node you want to check.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When given an invalid node.

Returns **[Observable](#observable)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** stat object for the node.

##### fromShell

An interface to [shelljs](https://github.com/shelljs/shelljs) to "attempt" to run
CLI commands in any OS.

**Parameters**

-   `command` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a command to run on the OS,

Returns **[Observable](#observable)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>** An array containing both stderr and stdout.

##### fromDirMake

Creates a directory.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The directory to be created.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When directory cannot be created.

Returns **[Observable](#observable)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** The path of the directory that was just created.

##### fromDirRequire

Requires a directory path, if the directory does not exists, it's created.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The requested directory.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When requested path exists and is not a directory.

Returns **[Observable](#observable)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** The path of the directory.

##### fromDirRead

Get path of nodes in given directory (non recursively).

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The requested directory.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When requested path exists and is not a directory.

Returns **[Observable](#observable)&lt;[Stream](#stream)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>>** The path of the directory.

##### fromDirReadRecursive

Get path of nodes in given directory (recursively).

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The requested directory.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When requested path exists and is not a directory.

Returns **[Observable](#observable)&lt;[Stream](#stream)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>>** The path of the directory.

##### fromFileRead

Reads a file from the disk.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The path to the file to read.

Returns **[Observable](#observable)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** The contents of the file.

##### fromFileWrite

Writes a file on the disk.

**Parameters**

-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The full path for the file.
-   `content` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The contents of the file.


-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** When the file cannot be written.

Returns **[Observable](#observable)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** The future value `true` if write was succesful.

### Observable

-   **See: <http://reactivex.io/rxjs/>**

A value that can be subscribed upon to be observed.

Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Stream

A stream of values returned by an <Observable>.

Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
