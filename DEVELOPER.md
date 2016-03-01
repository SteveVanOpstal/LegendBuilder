# Project setup

A few steps are required to setup this project but it shouldn't take long.

All commands mentioned should be ran from the project root.

## Prerequisite Software

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)).

* [Node.js](http://nodejs.org), (version `>=4.2.1` `<5`). It should include [npm](https://www.npmjs.com/) (node package manager). 
  * [TypeScript](https://www.npmjs.com/package/typescript) `npm install -g typescript`

## Getting started

### 1. Install packages
All packages for this project are stored in the 
[package.json](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/package.json) file and can be
retrieved by executing following command:
```
npm install
```

### 2. Compile typescript
A gulp task has been made for this:
```
gulp build
```

### 3. Setup node servers
In this project a few servers are made that run between the client and the [LOL API](https://developer.riotgames.com/).

#### 3.1 Create configuration files
There are two node servers available, each requires a configuration file. Placed at the root of the project.
 * staticServer.js: .static-server.json
 * matchServer.js: .match-server.json

It should contain the following items:
 * host
 * port

example:
```JSON
{
  "host": "127.0.0.1",
  "port": 1234
}
```

#### 3.2 .api.key
* Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you automagically have an api key.
* Create a file named `.api.key` and add the key to it.
* Place it at the root of the project.

#### 3.3 Run
Start the node servers by running these commands:
```
gulp start-static-server
gulp start-match-server
```

### 4. Run a HTTP server (live-server)
In development I recommend [Live Server](https://www.npmjs.com/package/live-server).

#### 4.1 Install
```
npm install -g live-server
```

#### 4.2 .live-server.json (optional)
As specified by [live-server usage](https://github.com/tapio/live-server#usage-from-node). Placed at the root of the project.

example:
```JSON
{
  "port": 8585,
  "file": "index.html",
  "ignore": "src/typings,src/server,.git,.vscode"
}
```

#### 4.3 start server
```
gulp start-live-server
```

## Visual Studio Code
I highly recommend the [Visual Studio Code](https://code.visualstudio.com/) IDE. 

It works well with for example gulp

tasks.json:

```JSON
{
  "version": "0.1.0",
  "command": "gulp",
  "isShellCommand": true,
  "showOutput": "silent",
  "tasks": [
    {
      "taskName": "build",
      "args": [],
      "isBuildCommand": true,
      "problemMatcher": "$tsc"
    }
  ]
}
```