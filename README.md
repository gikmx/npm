# [@gik/npm](https://github.com/gikmx/npm) *0.1.8*
> Scripts for your EcmaScript workflow.

##### Contributors
- [Héctor Menéndez](mailto:hector@gik.mx) []()

##### Supported platforms
- linux
- darwin

#### <a name="table-of-contents"></a> Table of contents
- **[gik-npm](#gik-npm)** Centralizes and automates the managment of projects based on EcmaScript.
  - **[Scripts](#gik-npm.Scripts)** The tasks available to run against your project.
    - **[build](#gik-npm.Scripts.build)** Transpiles the current project using **babel**.
    - **[docs](#gik-npm.Scripts.docs)** Generates documentation using [js-to-markdown](http://github.com/jsdoc-to-markdown/jsdoc-to-markdown).
    - **[lint](#gik-npm.Scripts.lint)** Validates the code complies with certain rules.
    - **[start](#gik-npm.Scripts.start)** A watcher for your scripts using [nodemon](http://github.com/remy/nodemon).
    - **[test](#gik-npm.Scripts.test)** Runs unit tests using [Jest](http://github.com/facebook/jest).
    - **[version](#gik-npm.Scripts.version)** Automates the versioning of your project using **semver**.
  - **[Configuration](#gik-npm.Configuration)** The default settings that control the behaviour of the scripts.


# <a name="gik-npm"></a> gik-npm

Centralizes and automates the managment of projects based on EcmaScript.

[create-react-app](https://github.com/facebookincubator/create-react-app) inspired us
to build this tool, it made our life way easier and so we decided to apply the same
principle to our workflow: A single place where to put all the configurationi and
automation for our projects in EcmaScript (meaning Node, Cycle, Webpack, React, etc.)

###### Installation
Nothing special, just like every other tool in your arsenal, install as development
dependency and you're good to go.

```bash
npm install --save-dev @gik/npm
```
###### Setup
Just add a reference to the "binary" `gik-npm` and pass the needed arguments according
to the task you wish to execute.

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>script</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>One of the <a href="#gik-npm.Scripts">Scripts</a> available.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[…param]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>Each script has it own set of optional arguments, check
<a href="#gik-npm.Scripts">their section</a> for more information.</td>
    </tr>
</table>


###### Example `package.json`
```js
{
    "scripts": {
        "build": "gik-npm build",
        "ver": "gik-npm version patch",
    }
}
```
###### Members

- [Scripts](#gik-npm.Scripts)
- [Configuration](#gik-npm.Configuration)

<small>**[▲ Top](#table-of-contents)**</small>

---

## <a name="gik-npm.Scripts"></a> Scripts

The tasks available to run against your project.


###### To do
- [ ] Add typedef for error codes and Observables.


###### Members

- [build](#gik-npm.Scripts.build)
- [docs](#gik-npm.Scripts.docs)
- [lint](#gik-npm.Scripts.lint)
- [start](#gik-npm.Scripts.start)
- [test](#gik-npm.Scripts.test)
- [version](#gik-npm.Scripts.version)

<small>**[▲ Top](#gik-npm)**</small>

---

### <a name="gik-npm.Scripts.build"></a> build

Transpiles the current project using **babel**.

###### Base (.babelrc)`
```javascript
{
    "presets": [
        ["env", {
            "targets": {
                "node": "6.11"
            },
            "modules": "commonjs",
            "useBuiltIns": "usage",
            "loose": false
        }],
        "stage-2"
    ],
    "plugins": [
        "dynamic-import-node"
    ]
}

```
The following `package.json` properties are available to you in case you wish to modify
the default behaviour.

###### Properties
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>babel</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Object">Object</a>
        </td>
        <td>Options for the babel transpiler.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.babelrc]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Read .babelrc found in context? <b>Default <code>true</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.comments]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Include comments?</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.compact]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Remove unneeded spaces?</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.minified]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Minify the number of characters? <b>Default <code>true</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.sourceMaps]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Wether to include sourcemaps or not.
<code>true</code> would output the sourcemap as external file. <code>false</code> omits it, and <code>&quot;inline&quot;</code>
 puts the contents of the sourcemaps on the same file as the code. <b>Default <code>inline</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[babel.extends]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The base .babelrc to extend from. The base file is
shown below. but your can specify your own path. Remember that if you put a file on
your own folder, it would be taked into account. granted the <code>babel.babelrc</code> property
is set to <code>true</code>.</td>
    </tr>
</table>


###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>

<small>**[▲ Top](#table-of-contents)**</small>

---

### <a name="gik-npm.Scripts.docs"></a> docs

Generates documentation using [js-to-markdown](http://github.com/jsdoc-to-markdown/jsdoc-to-markdown).
The template used for the documentation is customised, you can see how it looks here,
since this very documentation was generated by it. This is why even though this script
uses js-to-markdown several of their configuration propertes are not available due to
the heavy customisation it was done to its original template. Howevet the followin
ARE avaialble.

###### Default `jsdoc.json` config
```javascript
{
    "sourceType": "module",
    "recurseDepth": 10,
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    },
    "plugins": [
        "node_modules/jsdoc-babel"
    ]
}

````

###### Properties
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>jsdoc</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Object">Object</a>
        </td>
        <td>Options for the documentation generator.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[jsdoc.template]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The location of documentation
template. <b>Default <code>./template/README.md</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[private]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Wether to show private members or not.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[configure]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>An example of the base configuration is
shown below. <b>Default <code>root/.jsdocrc</code></b></td>
    </tr>
</table>


###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>
###### To do
- [ ] Add documentation about how to customize the template and the available helpers.



<small>**[▲ Top](#table-of-contents)**</small>

---

### <a name="gik-npm.Scripts.lint"></a> lint

Validates the code complies with certain rules.
It's recommended that you install one of the flavours of
[eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
it will be as easy as to include an `.eslintrc` file extending the module.

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[target]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a> | 
                <a href="#Array">Array</a>
        </td>
        <td>The target directory to lint. <b>Default <code>src</code></b></td>
    </tr>
</table>


###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>
###### Example `package.json`
```js
{
    "directories": {
        "example": './example'
    },
    "scripts": {
        "lint": "gik-npm lint example"
    },
    "devDependencies": {
         "@gik/eslint-config-node": "x.x.x" // Pick a flavour according to your project
    }
}
```
###### Example `.eslintrc`
```js
{
    "extends": "@gik/node" // Same as the module but without "eslint-config"
}
```

<small>**[▲ Top](#table-of-contents)**</small>

---

### <a name="gik-npm.Scripts.start"></a> start

A watcher for your scripts using [nodemon](http://github.com/remy/nodemon).

Below are the default properties that are being sent to the `nodemon` binary.

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>exec</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The command to run whenever changes are found.</td>
    </tr>
</table>

###### Properties
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[verbose]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#boolean">boolean</a>
        </td>
        <td>Show details of what&#39;s happening. <b>Default <code>true</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[ext]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The extensions that triggers changes. <b>Default <code>js json</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[watch]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Array">Array</a>
        </td>
        <td>The directories to monitor. <b>Default <code>[...$npm_package_directories]</code></b></td>
    </tr>
</table>


###### Related
- https://github.com/remy/nodemon#config-files
###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>

<small>**[▲ Top](#table-of-contents)**</small>

---

### <a name="gik-npm.Scripts.test"></a> test

Runs unit tests using [Jest](http://github.com/facebook/jest).
This script makes no assumptions for the jest configurations, it just transpiles the
test files using the same configuration as the [build](#gik-npm.Scripts.build) script
and uses Jest's defaults. Below is the configuration file used by the script.

###### Default configuration `.jest.js`
```javascript
const PATH = require('path');

module.exports = {
    verbose: false,
    testMatch: ['**/__tests__/**/*.js?(x)'], // only files inside the __tests__ folder
    transform: {
        '^.+\\.jsx?$': PATH.join(__dirname, 'lib', 'test-transform'),
    },
};


```

you can customize the arguments sent to the `jest` cli interface by changing the
following properties on `package.json`.

###### Properties
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[projects]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Array">Array</a>
        </td>
        <td>The projects to test. <b>Default <code>path/to/your/project</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[rootDir]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>Just will run on this context. <b>Default <code>path/to/your/project</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[config]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>Use this file to customize further. <b>Default <code>path/to/default/config</code></b></td>
    </tr>
</table>


###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>
###### Example `package.json`
```js
{
    "@gik/npm": {
         "jest": {
              "config": "path/to/your/config",
         }
     }
    "scripts": {
        "test": "gik-npm test", // runs test on all files on "./test"
        "test:cover": "gik-npm test cover", // runs test and generates coverage report
    }
}
```

<small>**[▲ Top](#table-of-contents)**</small>

---

### <a name="gik-npm.Scripts.version"></a> version

Automates the versioning of your project using **semver**.
internally uses `npm version` (avoiding tagging) and after modifying `package.json`
adds it to git. This is specially useful if you add it to a `precommit` script
(already available when using this library via [husky](https://github.com/typicode/husky)),
making the change available on that commit automatically.

###### Available semver types:
- **major** `0.0.0 -> 1.0.0`
- **minor** `0.0.0 -> 0.1.0`
- **patch** `0.0.0 -> 0.0.1`
- **prerelease**
  - `0.0.0 -> 0.0.0-1`
  - `0.0.0-beta -> v0.0.0-beta.0`
  - `0.0.0-beta.0 -> 0.0.0-beta.1`

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[type]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>One of the valid semver version names. <b>Default <code>patch</code></b></td>
    </tr>
</table>


###### Returns
 [`gik-npm.Types.Observable`](#gik-npm.Types.Observable) <span style="font-weight:normal"> - An observable which `gik-npm` will subscribe to
in order to execute it.</span>
###### Example `packge.json`
```js
{
    "scripts": {
        // builds, bumps package.json and generartes docs using the new version
        "precommit": "gik-npm build && gik-npm version patch && git-npm docs"
    }
}
```

<small>**[▲ Top](#table-of-contents)**</small>

---

## <a name="gik-npm.Configuration"></a> Configuration

The default settings that control the behaviour of the scripts.

###### Properties
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>directories</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Object">Object</a>
        </td>
        <td>Lets NPM know where are some directories.
This has the added benefit of letting you use this assign environment variables
Either on your project or in their scripts object.</td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[directories.src]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The path for the source files. <b>Default <code>./src</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[directories.out]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The path for the transpiled files. <b>Default <code>./lib</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>[directories.template]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The path for the template files. <b>Default <code>./template</code></b></td>
    </tr><tr>
        <td style="white-space: nowrap;">
            <code>@gik/npm</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#Object">Object</a>
        </td>
        <td>The container for the script-specific options. Check
<a href="#gik-npm.Scripts">their section</a> for more information.</td>
    </tr>
</table>


###### Example `package.json`
```js
{
    "directories": {
         "src": "./src",
         "out": "./lib"
     },
    "scripts": {
         "example": "your-script $npm_package_directories_src"
     },
    "@gik/npm": {
        "doc": "./README.md"
    },
}
```

<small>**[▲ Top](#table-of-contents)**</small>

---

