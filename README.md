# [@gik/npm](https://github.com/gikmx/npm) *0.0.32*
> GIK's take on NPM scripts.

[![NPM](https://nodei.co/npm-dl/@gik/npm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@gik/npm/)
[![HitCount](http://hits.dwyl.io/gikmx/npm.svg)](http://hits.dwyl.io/gikmx/npm)

##### Contributors
- [Héctor Menéndez](mailto:hector@gik.mx) []()

##### Supported platforms
- linux
- darwin

## Usage

## npm
>  global namespace

This is a descrition for the npm namespace.


## [⇧](#Usage)

### version
> module of `npm`


Automates the versioning of your packages using **semver**.
internally uses `npm version` (avoiding tagging) and after modifying `package.json`
adds it to git. This is specially useful if you add it to a `precommit` script
(already available when using this library via [husky](https://github.com/typicode/husky)),
making the change available on that commit automatically.

Available semver types:
- major `0.0.0 -> 1.0.0`
- minor `0.0.0 -> 0.1.0`
- patch `0.0.0 -> 0.0.1`
- prerelease
  - `0.0.0 -> 0.0.0-1`
  - `0.0.0-beta -> v0.0.0-beta.0`
  - `0.0.0-beta.0 -> 0.0.0-beta.1`


## [⇧](#Usage)

### test
> module of `npm`


Runs all test found in the `$npm_package_directories_test` directory.
- `cover` Generates coverage report after tests.
  - `check` Verifies if coverage passes threshold. (uses `.nycrc` on `test` dir)
  - `report` Outputs the last report.
    - `lcov` Outputs the last report using lcov instead.


## [⇧](#Usage)

### lint
> module of `npm`


Validates the code complies with certain rules.
It's recommended that you install one of the flavours of
[eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
it will be as easy as to include an `.eslintrc` file extending the module.


## [⇧](#Usage)

### docs
> module of `npm`


Generates documentation using [js-2-markdown](http://github.com/jsdoc-to-markdown/jsdoc-to-markdown).


## [⇧](#Usage)

### build
> module of `npm`


Transpiles your project using **babel**.
###### Default configuration `(.babelrc)`
```javascript
<%= file:./babelrc =%>
```


## [⇧](#Usage)

### Configuration
> module of `npm`


The default settings that control the behaviour of the scripts.


## [⇧](#Usage)

### Scripts
>  static class of `npm`



## [⇧](#Usage)

#### Scripts
> constructor of `npm.Scripts`


The binary that controls which script is going to be run.


## [⇧](#Usage)

## Tools





## [⇧](#Usage)

### $
>  static property of `Tools`

RXjs Observables.


## [⇧](#Usage)

### Debug
>  static method of `Tools`

Makes debugging a little bit prettier.

**See**: https://github.com/visionmedia/debug  

## [⇧](#Usage)

### Tools.Config





## [⇧](#Usage)

#### $fromConfig
>  static method of `Tools.Config`

A parsed version of package.json.

**Returns**: <code>Observable</code> - - Resolves to an object containing the parsed package.json.  

## [⇧](#Usage)

#### Config
>  static property of `Tools.Config`

The raw version of the package.json.


## [⇧](#Usage)

#### Tools.Config.exports





## [⇧](#Usage)

##### Defaults
>  static property of `Tools.Config.exports`

The raw version of the host package.json.


## [⇧](#Usage)

#### Tools.$.$





## [⇧](#Usage)

##### fromFileWrite
>  static method of `Tools.$.$`

Writes a file on the disk.

**Returns**: <code>Observable.&lt;string&gt;</code> - - The future value `true` if write was succesful.  
**Throws**:

- <code>Error</code> - When the file cannot be written.


## [⇧](#Usage)

##### fromFileRead
>  static method of `Tools.$.$`

Reads a file from the disk.

**Returns**: <code>Observable.&lt;string&gt;</code> - - The contents of the file.  

## [⇧](#Usage)

##### fromDirReadRecursive
>  static method of `Tools.$.$`

Get path of nodes in given directory (recursively).

**Returns**: <code>Observable.&lt;Stream.&lt;string&gt;&gt;</code> - - The path of the directory.  
**Throws**:

- <code>Error</code> - When requested path exists and is not a directory.


## [⇧](#Usage)

##### fromDirRead
>  static method of `Tools.$.$`

Get path of nodes in given directory (non recursively).

**Returns**: <code>Observable.&lt;Stream.&lt;string&gt;&gt;</code> - - The path of the directory.  
**Throws**:

- <code>Error</code> - When requested path exists and is not a directory.


## [⇧](#Usage)

##### fromDirRequire
>  static method of `Tools.$.$`

Requires a directory path, if the directory does not exists, it's created.

**Returns**: <code>Observable.&lt;string&gt;</code> - - The path of the directory.  
**Throws**:

- <code>Error</code> - When requested path exists and is not a directory.


## [⇧](#Usage)

##### fromDirMake
>  static method of `Tools.$.$`

Creates a directory.

**Returns**: <code>Observable.&lt;string&gt;</code> - - The path of the directory that was just created.  
**Throws**:

- <code>Error</code> - When directory cannot be created.


## [⇧](#Usage)

##### fromShell
>  static method of `Tools.$.$`

An interface to [shelljs](https://github.com/shelljs/shelljs) to "attempt" to run
CLI commands in any OS.

**Returns**: <code>Observable.&lt;Array&gt;</code> - - An array containing both stderr and stdout.  

## [⇧](#Usage)

##### fromStat
>  static method of `Tools.$.$`

Determine statistics about a file system node.

**See**: https://nodejs.org/api/fs.html#fs_class_fs_stats  
**Returns**: <code>Observable.&lt;Object&gt;</code> - - stat object for the node.  
**Throws**:

- <code>Error</code> - When given an invalid node.


## [⇧](#Usage)

##### fromAccess
>  static method of `Tools.$.$`

Determine if given path is accessible.

**Returns**: <code>Observable.&lt;boolean&gt;</code> - - Wether the file is accessible or not.  

## [⇧](#Usage)

