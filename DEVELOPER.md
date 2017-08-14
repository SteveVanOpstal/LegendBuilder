# Project setup

A few steps are required to setup this project but it shouldn't take long.

All commands mentioned should be ran from the project root.

## <a name="prerequisites"></a> Prerequisite Software

* [Git](http://git-scm.com) (a **GitHub app** exists for [Mac or Windows](http://desktop.github.com), but use whatever you prefer).
* [Node.js](http://nodejs.org). It should include [npm](https://www.npmjs.com/) (node package manager).
* (optional) [Yarn](https://yarnpkg.com), can be used instead of npm

## <a name="start"></a> Getting started

### <a name="install"></a> 1. Install packages

All packages for this project can be retrieved by executing following command:

```bash
npm install
```

### <a name="config"></a> 2. Configuration (optional)

A few servers are set up for this project and the settings for them are available in the `src/server/settings.json` file.
These are the default values that can be altered via an override:

```json
{
    "host": "legendbuilder.io",
    "port": null,
    "static": {
        "port": 8081
    },
    "match": {
        "port": 8082,
        "sampleSize": 32
    },
    "api": {
        "regions": [
            "ru",
            "kr",
            "pbe1",
            "br1",
            "oc1",
            "jp1",
            "na1",
            "eun1",
            "euw1",
            "tr1",
            "la1"
        ],
        "versions": {
            "summoner": "v3",
            "match": "v3",
            "static-data": "v3",
            "status": "v3"
        }
    },
    "gameTime": 2700000
}
```

The following setup is probably useful:

```json
{
  "host": "localhost",
  "port": 8080
}
```

### <a name="setup"></a> 3. Setup node servers

This project runs two servers to retrieve data from the [Riot Games API](https://developer.riotgames.com/).
This is a guide on how to set them up.

#### 3.1 Create `api.key`

Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you have an api key.
Create a file named `api.key` and add the key to it.
Place it in a `./secure` folder.

#### 3.2 Create `cert.crt` and `key.pem`

Create a certificate and private key (see [3.2.1](DEVELOPER.md#lets-encrypt) or [3.2.2](DEVELOPER.md#self-signed)), name them `cert.crt` and `cert.key` respectively.
Place them in a root folder called `./secure`.

We limit ourselves to HTTPS and do not support HTTP (even in development). 
The advantages:

* No need for two types of the same server
* Any issues regarding SSL can be found during development
* HTTP can't accidentally be activated in production

The disadvantages:

* requires certificates (in development this can be annoying)

##### <a name="lets-encrypt"></a> 3.2.1 Let's Encrypt

The certificates provided by [Let's Encrypt](https://letsencrypt.org/) are free and are [trusted by almost all browsers](https://letsencrypt.org/docs/certificate-compatibility/).
Find yourself an [ACME client](https://letsencrypt.org/docs/client-options/) and generate a certificate.
Certificates issued by [Let's Encrypt](https://letsencrypt.org/) last 90 days, automating certificate renewal will save you time.

##### <a name="self-signed"></a> 3.2.2 Self signed

###### 3.2.2.1 Open SSL
With OpenSSL you can create self signed certificates like this:

```bash
openssl req -x509 -newkey rsa:4096 -keyout cert.key -out cert.crt -days 365 -nodes
```

The browser will warn you that the website is insecure but as you are running this locally you can ignore this.

###### 3.2.2.2 Self signed with SAN

See [SteveVanOpstal/self-signed-cert](https://github.com/SteveVanOpstal/self-signed-cert)

### <a name="start"></a> 4. Start

The following script will start all the servers necessary to develop/test/debug.

```bash
npm run start
```

Now you can open the website in your browsers using '[https://localhost:8080](https://localhost:8080)' (can be another url depending on your [http-server configuration](DEVELOPER.md#config)).

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

## <a name="chrome-debugger"></a> Debugger for Chrome (VSCode)

A launch setup similar to the following would probably suffice:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Chrome localhost",
      "url": "https://localhost:8080",
      "webRoot": "${workspaceRoot}"
    }
  ]
}
```

### <a name="wds"> Error: `[WDS] disconnected!`

Chrome does not accept the self signed certificate of webpack-dev-server as it does not contain a SAN.

1. Execute [SteveVanOpstal/self-signed-cert](https://github.com/SteveVanOpstal/self-signed-cert)
1. Replace that certificate with the certificate in the `./node_modules/webpack-dev-server/ssl` folder.
1. Add the certificate to Chrome (`Settings` > `Advanced Settings` > `Certificates` > `Trusted Root Certificates` > `Import..`)

This might not be necessary: A fix is on the way for webpack-dev-server [webpack/webpack-dev-server#987](https://github.com/webpack/webpack-dev-server/pull/987).
