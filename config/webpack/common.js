const webpack = require('webpack');
const helpers = require('../../helpers');

var DefinePlugin = require('webpack/lib/DefinePlugin');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

const METADATA = {
  title: 'Legend Builder',
  baseUrl: '/'
};

module.exports = {
  metadata: METADATA,

  resolve: {
    extensions: ['', '.ts', '.js'],
    root: helpers.root('src/client'),
    modulesDirectories: ['node_modules']
  },

  module: {loaders: [{test: /\.json$/, loader: 'json-loader'}]},

  plugins: [new TsConfigPathsPlugin()]
};
