# [@gik/npm](https://github.com/gikmx/npm) *0.1.0*
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
    - **[test](#gik-npm.Scripts.test)** Runs all test found in the `$npm_package_directories_test` directory.
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


###### Members

- [build](#gik-npm.Scripts.build)
- [docs](#gik-npm.Scripts.docs)
- [lint](#gik-npm.Scripts.lint)
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
            "target": {
                "node": ">=6.11.0"
            },
            "useBuiltIns": "usage"
        }],
        "stage-2"
    ],
    "plugins": [
        "syntax-dynamic-import"
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


###### To do
- [ ] Write documentation about how to customize the template and the available helpers.



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

### <a name="gik-npm.Scripts.test"></a> test

Runs all test found in the `$npm_package_directories_test` directory.
It uses internally [AVA](https://github.com/avajs/ava) as test runner, and
[nyc](https://github.com/istanbuljs/nyc) for coverage reports. Everything is configured
with the same [configuration](#gik-npm.Scripts.build.configuration) as the
[`build`](#gik-npm.Scripts.build) script with the difference that files aren't
transpiled, instead they're run using `babel-register`.

###### Availabe subcommands
- `cover` Generates coverage report after tests.
  - `check` Verifies if coverage passes threshold. (uses `.nycrc` on `test` dir)
  - `report` Outputs the last report.
    - `lcov` Outputs the last report using lcov instead.

###### Parameters
<table>
    <tr>
        <td style="white-space: nowrap;">
            <code>[…task]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>One on the subactions.</td>
    </tr>
</table>


###### Example `package.json`
```js
{
    "directories": {
        "test": "./test"
    },
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
            <code>[directories.test]</code>
        </td>
        <td style="white-space: nowrap;">
                <a href="#string">string</a>
        </td>
        <td>The path for the test files. <b>Default <code>./test</code></b></td>
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

<small>**[▲ Top](#table-of-contents)**</small>

---

