<p align="center" style="margin-bottom: 100px;">
  <a href="http://legendbuilder.io">
    <img height="120" src="https://cdn.rawgit.com/SteveVanOpstal/LegendBuilder/master/src/assets/logo.svg">
  </a>
  <h3 align="center">Legend Builder</h3>
  <p align="center">An advanced <a href="http://www.leagueoflegends.com/">League of Legends</a> champion builder</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>
</p>

[![Build Status](https://travis-ci.org/SteveVanOpstal/LegendBuilder.svg?branch=master)](https://travis-ci.org/SteveVanOpstal/LegendBuilder)
[![Coverage Status](https://coveralls.io/repos/github/SteveVanOpstal/LegendBuilder/badge.svg)](https://coveralls.io/github/SteveVanOpstal/LegendBuilder)
[![Dependency Status](https://img.shields.io/david/SteveVanOpstal/LegendBuilder.svg)](https://david-dm.org/SteveVanOpstal/LegendBuilder) [![devDependency Status](https://img.shields.io/david/dev/SteveVanOpstal/LegendBuilder.svg)](https://david-dm.org/SteveVanOpstal/LegendBuilder?type=dev)
[![License](https://img.shields.io/github/license/SteveVanOpstal/LegendBuilder.svg)](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/SteveVanOpstal/LegendBuilder.svg)](https://gitter.im/SteveVanOpstal/LegendBuilder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/SteveVanOpstal.svg)](https://saucelabs.com/u/SteveVanOpstal)


Legend Builder is currently in **Alpha**.

#### Contributing

Enter [Issues](https://github.com/SteveVanOpstal/LegendBuilder/pulls) or [Pull requests](https://github.com/SteveVanOpstal/LegendBuilder/pulls) at their respective pages. Take a look at the [contributing guidelines](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/CONTRIBUTING.md) for more information.

A detailed guide on how to setup the project is available at [DEVELOPER.md](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/DEVELOPER.md).

#### Technical aspects

*frontend*: [Angular](https://angular.io/) app using [Angular CLI](https://github.com/angular/angular-cli), [Sass](http://sass-lang.com/), [d3](https://d3js.org/), [RxJS](https://github.com/ReactiveX/rxjs) etc.
The project keeps up to date with the latest production version of Angular (no alpha/rc versions).

*backend*: [Node.js](https://nodejs.org/en/) servers connecting to the [Riot Games API](https://developer.riotgames.com/).

*testing*: Unit tests are run on every code change, on 7 browsers and 21 browser versions (See [latest build](https://travis-ci.org/SteveVanOpstal/LegendBuilder)) using: [Jasmine](https://jasmine.github.io/), [Karma](https://karma-runner.github.io), [Travis CI](https://travis-ci.org) and [SauceLabs](https://saucelabs.com/). The results of the latest tests are on the top of this readme.

*extra*: A release is made using one command (`npm run release`). The script will bump the version, create a [changelog](https://github.com/SteveVanOpstal/LegendBuilder/blob/master/CHANGELOG.md), push the [release to GitHub](https://github.com/SteveVanOpstal/LegendBuilder/releases) and [post the release on Reddit](https://www.reddit.com/r/LegendBuilder/).

