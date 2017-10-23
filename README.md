# [@gik/npm](https://github.com/gikmx/npm) *0.1.1*
> Scripts for your EcmaScript workflow.

##### Contributors
- [Héctor Menéndez](mailto:hector@gik.mx) []()

##### Supported platforms
- linux
- darwin

#### <a name="table-of-contents"></a> Table of contents

  - **[gik-npm](#gik-npm)** Centralizes and automates the managment of projects based on EcmaScript.
    - **[Configuration](#gik-npm.Configuration)** The default settings that control the behaviour of the scripts.
    - **[Scripts](#gik-npm.Scripts)** The tasks available to run against your project.
      - **[version](#gik-npm.Scripts.version)** Automates the versioning of your project using **semver**.
      - **[test](#gik-npm.Scripts.test)** Runs all test found in the `$npm_package_directories_test` directory.
      - **[lint](#gik-npm.Scripts.lint)** Validates the code complies with certain rules.
      - **[docs](#gik-npm.Scripts.docs)** Generates documentation using [js-to-markdown](http://github.com/jsdoc-to-markdown/jsdoc-to-markdown).
      - **[build](#gik-npm.Scripts.build)** Transpiles the current project using **babel**.

---

## <a name="gik-npm"></a> gik-npm


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
        <td>`script`</td>
        <td>[string]()</td>
        <td>One of the [Scripts](#gik-npm.Scripts) available.</td>
    </tr><tr>
        <td>`[…param]`</td>
        <td>[string]()</td>
        <td>Each script has it own set of optional arguments, check
[their section](#gik-npm.Scripts) for more information.</td>
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

- [Configuration](#gik-npm.Configuration)
- [Scripts](#gik-npm.Scripts)

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

### <a name="gik-npm.Configuration"></a> Configuration


The default settings that control the behaviour of the scripts.


###### Properties

<table>
    <tr>
        <td>`directories`</td>
        <td>[Object]()</td>
        <td>Lets NPM know where are some directories.
This has the added benefit of letting you use this assign environment variables
Either on your project or in their scripts object.</td>
    </tr><tr>
        <td>`[directories.src]`</td>
        <td>[string]()</td>
        <td>The path for the source files. **Default `./src`**</td>
    </tr><tr>
        <td>`[directories.out]`</td>
        <td>[string]()</td>
        <td>The path for the transpiled files. **Default `./lib`**</td>
    </tr><tr>
        <td>`[directories.test]`</td>
        <td>[string]()</td>
        <td>The path for the test files. **Default `./test`**</td>
    </tr><tr>
        <td>`[directories.template]`</td>
        <td>[string]()</td>
        <td>The path for the template files. **Default `./template`**</td>
    </tr><tr>
        <td>`@gik/npm`</td>
        <td>[Object]()</td>
        <td>The container for the script-specific options. Check
[their section](#gik-npm.Scripts) for more information.</td>
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

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

### <a name="gik-npm.Scripts"></a> Scripts


The tasks available to run against your project.




###### Members

- [version](#gik-npm.Scripts.version)
- [test](#gik-npm.Scripts.test)
- [lint](#gik-npm.Scripts.lint)
- [docs](#gik-npm.Scripts.docs)
- [build](#gik-npm.Scripts.build)

## [<small><small><small>⬆ Top</small></small></small>](#gik-npm)

#### <a name="gik-npm.Scripts.version"></a> version


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
        <td>`[type]`</td>
        <td>[string]()</td>
        <td>One of the valid semver version names. **Default `patch`**</td>
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

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

#### <a name="gik-npm.Scripts.test"></a> test


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
        <td>`[…task]`</td>
        <td>[string]()</td>
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

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

#### <a name="gik-npm.Scripts.lint"></a> lint


Validates the code complies with certain rules.
It's recommended that you install one of the flavours of
[eslint-config](http://github.come/gikmx/eslint-config) to accompany this script.
it will be as easy as to include an `.eslintrc` file extending the module.

###### Parameters

<table>
    <tr>
        <td>`[target]`</td>
        <td>[string]() | [Array]()</td>
        <td>The target directory to lint. **Default `src`**</td>
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

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

#### <a name="gik-npm.Scripts.docs"></a> docs


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
        <td>`jsdoc`</td>
        <td>[Object]()</td>
        <td>Options for the documentation generator.</td>
    </tr><tr>
        <td>`[jsdoc.template]`</td>
        <td>[string]()</td>
        <td>The location of documentation
template. **Default `./template/README.md`**</td>
    </tr><tr>
        <td>`[private]`</td>
        <td>[boolean]()</td>
        <td>Wether to show private members or not.</td>
    </tr><tr>
        <td>`[configure]`</td>
        <td>[string]()</td>
        <td>An example of the base configuration is
shown below. **Default `root/.jsdocrc`**</td>
    </tr>
</table>



###### ToDo

- [ ] Write documentation about how to customize the template and the available helpers.

## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

#### <a name="gik-npm.Scripts.build"></a> build


Transpiles the current project using **babel**.

###### Base (.babelrc)`
```javascript
{
    "presets": [
        ["env", {
            "target": {
                "node": "current"
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
        <td>`babel`</td>
        <td>[Object]()</td>
        <td>Options for the babel transpiler.</td>
    </tr><tr>
        <td>`[babel.babelrc]`</td>
        <td>[boolean]()</td>
        <td>Read .babelrc found in context? **Default `true`**</td>
    </tr><tr>
        <td>`[babel.comments]`</td>
        <td>[boolean]()</td>
        <td>Include comments?</td>
    </tr><tr>
        <td>`[babel.compact]`</td>
        <td>[boolean]()</td>
        <td>Remove unneeded spaces?</td>
    </tr><tr>
        <td>`[babel.minified]`</td>
        <td>[boolean]()</td>
        <td>Minify the number of characters? **Default `true`**</td>
    </tr><tr>
        <td>`[babel.sourceMaps]`</td>
        <td>[boolean]()</td>
        <td>Wether to include sourcemaps or not.
`true` would output the sourcemap as external file. `false` omits it, and `"inline"`
 puts the contents of the sourcemaps on the same file as the code. **Default `inline`**</td>
    </tr><tr>
        <td>`[babel.extends]`</td>
        <td>[string]()</td>
        <td>The base .babelrc to extend from. The base file is
shown below. but your can specify your own path. Remember that if you put a file on
your own folder, it would be taked into account. granted the `babel.babelrc` property
is set to `true`.</td>
    </tr>
</table>




## [<small><small><small>⬆ Top</small></small></small>](#table-of-contents)

