# Project setup

A few steps are required to setup this project but it shouldn't take long.

All commands mentioned should be ran from the project root.

## <a name="prerequisites"></a> Prerequisite Software

* [Git](http://git-scm.com) (a **GitHub app** exists for [Mac or Windows](http://desktop.github.com), but use whatever you prefer).
* [Node.js](http://nodejs.org), (version `>=4.2.1` `<5`). It should include [npm](https://www.npmjs.com/) (node package manager).

## <a name="start"></a> Getting started

### <a name="install"></a> 1. Install packages
All packages for this project can be retrieved by executing following command:
```shell
npm install
```

### <a name="config"></a> 2. Configuration (optional)
A few servers are set up for this project and the settings for them are available in the `src/server/settings.json` file.
These are the default values that can be altered via an override:
```JavaScript
{
  httpServer: {
    host: 'localhost',
    port: 8080
  },
  staticServer: {
    host: 'localhost',
    port: 8081
  },
  matchServer: {
    host: 'localhost',
    port: 8082,
    sampleSize: 32
  },
  apiVersions: {
    'summoner': 'v1.4',
    'matchlist': 'v2.2',
    'match': 'v2.2',
    'static-data': 'v1.2',
  },
  gameTime: 45 * 60 * 1000
}
```

### <a name="setup"></a> 3. Setup node servers
This project runs two servers to retrieve data from the [Riot Games API](https://developer.riotgames.com/).
This is a guide on how to set them up.

#### 3.1 Create `api.key`
Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you have an api key.
Create a file named `api.key` and add the key to it.
Place it in a `./secure` folder.

#### 3.2 Create `cert.pem` and `key.pem`
Create a certificate and private key (see [3.2.1](DEVELOPER.md#lets-encrypt) or [3.2.2](DEVELOPER.md#openssl)), name them `cert.pem` and `key.pem` respectively.
Place them in a `./secure` folder.

We limit ourselves to HTTPS and do not support HTTP (even in development). 
The advantages:
 - No need for two types of the same server
 - Any issues regarding SSL can be found during development
 - HTTP can't accidentally be activated in production

The disadvantages:
 - requires certificates (in development this can be annoying)

##### <a name="lets-encrypt"></a> 3.2.1 Let's Encrypt
The certificates provided by [Let's Encrypt](https://letsencrypt.org/) are free and are [trusted by almost all browsers](https://letsencrypt.org/docs/certificate-compatibility/).
Find yourself an [ACME client](https://letsencrypt.org/docs/client-options/) and generate a certificate.
Certificates issued by [Let's Encrypt](https://letsencrypt.org/) last 90 days, automating certificate renewal will save you time.

##### <a name="openssl"></a> 3.2.2 OpenSSL
With OpenSSL you can create self signed certificates like this:
```shell
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```
The browser will warn you that the website is insecure but as you are running this locally you can ignore this.

### <a name="start"></a> 4. Start
The following script will start all the servers necessary to develop/test/debug.
```shell
npm run start
```
Now you can open the website in your browsers using '[https://localhost:8080](https://localhost:8080)' (can be another url depending on your [http-server configuration](DEVELOPER.md#config)).


## <a name="reddit"></a> Reddit Release
Every release a python script will generate a post on reddit. To improve this script or to create new scripts the following software is required:

* [Python](https://www.python.org/downloads/), (version `>=3.5.1`). It should include [pip](https://pypi.python.org/pypi/pip) (Pip Installs Packages). 
  * [praw](https://praw.readthedocs.org) (`pip install praw`)

`src/reddit/settings.json`:
```JSON
{
  "SUBREDDIT": "LegendBuilder",
  "REDDIT_USERNAME": "LookAtMeImRedditNow",
  "REDDIT_PASSWORD": "LegendBuilderDaBest"
}
```

## <a name="clang-format"></a> ClangFormat
ClangFormat will format `TypeScript` and `JavaScript` code according to the style-guide ([CONTRIBUTING.md](CONTRIBUTING.md#rules)) of this project.
The following command will format all `.ts` files:
```shell
npm run format
```

### Visual Studio Code
A plugin for VSCode is available: [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
```shell
ext install clang-format
```

Following VSCode settings are required:
```JSON
{
  "clang-format.executable": "./node_modules/clang-format/bin/[platform]/clang-format"
}
```

## <a name="csscomb"></a> CSScomb
CSScomb will format `CSS` code according to the style-guide ([CONTRIBUTING.md](CONTRIBUTING.md#rules)) of this project.
The following command will format all `.css` files:
```shell
npm run format:css
```

### Visual Studio Code
A plugin for VSCode is available: [CSScomb](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb)
```shell
ext install vscode-csscomb
```

Following VSCode settings are required:
```JSON
{
  "csscomb.preset": "./config/csscomb.json"
}
```

## <a name="tslint"></a> TSLint / Codelyzer
TSLint and Codelyzer will perform static code analysis to improve the readability and cohesion of the code.
The following command will check all `.ts` files:
```shell
npm run lint
```

### Visual Studio Code
A plugin for VSCode is available: [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
```shell
ext install tslint
```

Following VSCode settings are required:
```JSON
{
  "tslint.configFile": "./config/tslint.json",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```
