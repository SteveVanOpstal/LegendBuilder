# Project setup

A few steps are required to setup this project but it shouldn't take long.

All commands mentioned should be ran from the project root.

## <a name="prerequisites"></a> Prerequisite Software

* [Git](http://git-scm.com) (a **GitHub app** exists for [Mac or Windows](http://desktop.github.com), but use whatever you prefer).
* [Node.js](http://nodejs.org) >= v8.6.0. It should include [npm](https://www.npmjs.com/) (node package manager).
* (optional) [Yarn](https://yarnpkg.com), can be used instead of npm

## <a name="start"></a> Getting started

### <a name="install"></a> 1. Install packages

All packages for this project can be retrieved by executing following command:

```bash
npm install
```

### <a name="config"></a> 2. Configuration (optional)

A few servers are set up for this project and the settings for them are available in the `src/server/settings.json` file.
The following setup is probably useful:

```json
{
  "host": "localhost",
  "port": 4200
}
```

### <a name="setup"></a> 3. Setup node servers

This project runs two servers to retrieve data from the [Riot Games API](https://developer.riotgames.com/).
This is a guide on how to set them up.

#### 3.1 Create `api.key`

Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you have an api key.
Create a file named `api.key` and add the key to it.
Place it in a `./secure` folder.

## <a name="reddit"></a> Reddit Release

Every release a python script will generate a post on reddit. To improve this script or to create new scripts the following software is required:

* [Python](https://www.python.org/downloads/), (version `>=3.5.1`). It should include [pip](https://pypi.python.org/pypi/pip) (Pip Installs Packages).
  * [praw](https://praw.readthedocs.org) (`pip install praw`)

`src/reddit/settings.json`:

```json
{
  "SUBREDDIT": "LegendBuilder",
  "REDDIT_USERNAME": "LookAtMeImRedditNow",
  "REDDIT_PASSWORD": "LegendBuilderDaBest"
}
```

## <a name="clang-format"></a> ClangFormat

ClangFormat will format `TypeScript` and `JavaScript` code according to the style-guide ([CONTRIBUTING.md](CONTRIBUTING.md#rules)) of this project.
The following command will format all `.ts` files:

```bash
npm run format
```

### Visual Studio Code
A plugin for VSCode is available: [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)

```bash
ext install clang-format
```

Following VSCode settings are required:

```json
{
  "clang-format.executable": "./node_modules/clang-format/bin/[platform]/clang-format"
}
```

## <a name="csscomb"></a> CSScomb

CSScomb will format `CSS` code according to the style-guide ([CONTRIBUTING.md](CONTRIBUTING.md#rules)) of this project.
The following command will format all `.css` files:

```bash
npm run format:css
```

### Visual Studio Code

A plugin for VSCode is available: [CSScomb](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)

```bash
ext install vscode-csscomb
```

Following VSCode settings are required:

```json
{
  "csscomb.preset": "./config/csscomb.json"
}
```

## <a name="tslint"></a> TSLint / Codelyzer

TSLint and Codelyzer will perform static code analysis to improve the readability and cohesion of the code.
The following command will check all `.ts` files:

```bash
npm run lint
```

### Visual Studio Code

A plugin for VSCode is available: [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

```bash
ext install tslint
```

Following VSCode settings are required:

```json
{
  "tslint.configFile": "./config/tslint.json",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```
