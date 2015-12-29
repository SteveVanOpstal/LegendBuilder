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

### 3. Add your LOL API key
* Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you automagically have an api key.
* Create a file containing only this key and name it `api.key`.
* Place it in this folder: `[root]/src/server`.

### 4. Run server
A node server ([server.js](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/src/server/server.js)) is made to communicate with the League Of Legends API, start it by running this command:
```
gulp start-server
```
or
```
node src/server/server.js
```

### 5. Run a HTTP server
In development I recommend [Live Server](https://www.npmjs.com/package/live-server).
It can be installed by running this command:
```
npm install -g live-server
```
Start it by running this command:
```
gulp start-live-server
```
or
```
live-server --port=5858 --entry-file=index.html
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