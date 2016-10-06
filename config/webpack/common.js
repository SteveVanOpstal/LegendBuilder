const webpack = require('webpack');
const helpers = require('../../helpers');

var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

module.exports = {
  resolve: {extensions: ['.ts', '.js'], modules: ['node_modules']},

  module: {loaders: [{test: /\.json$/, loader: 'json-loader'}]},

  plugins: [new TsConfigPathsPlugin()]
};
