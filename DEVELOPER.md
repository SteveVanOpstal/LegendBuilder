# Project setup

A few steps are required to setup this project but it shouldn't take long.

All commands mentioned should be ran from the project root.

## Prerequisite Software

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)).

* [Node.js](http://nodejs.org), (version `>=4.2.1 <5`). It includes [npm](https://www.npmjs.com/) (node package manager). 

## Getting started

### 1. Install packages
All packages for this project are stored in the 
[package.json](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/package.json) file and can be
retrieved by executing following command:
```
  npm install
```

### 2. Install global packages

* typescript compiler
```
  npm install -g tsc
```

* live-server (optional)
```
  npm install -g live-server
```

### 4. Compile typescript
A gulp task has been made for this:
```
  gulp compile
```

### 3. Add your LOL API key
* Create an account at [developer.riotgames.com](https://developer.riotgames.com/). Now you automagically also have an api key.
* Create a file containing only this key and name it `api.key`.
* Place it in this folder: `[root]/src/server`.

### 4. Run server
A node server is required to communicate with the League Of Legends API, start it by running this command:
```
  npm start
```

### 5. Run a HTTP server
In development I recommend live-server as mentioned before, start it by running this command:
```
  npm run live-server
```