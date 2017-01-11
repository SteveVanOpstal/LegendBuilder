var helpers = require('../helpers');

/* plugins */
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var {CheckerPlugin} = require('awesome-typescript-loader');

module.exports = function(options) {
  if (!options) {
    options = {};
  }

  var ENV = process.env.ENV = process.env.NODE_ENV = options.dev ? 'development' : 'production';

  return {
    target: 'node',
    devtool: options.dev ? 'source-map' : false,

    resolve: {extensions: ['.ts', '.js'], modules: [helpers.root('src/server'), 'node_modules']},

    entry: {
      'static-server': helpers.root('src/server/static/server.ts'),
      'match-server': helpers.root('src/server/match/server.ts'),
    },

    output: {path: helpers.root('build/dist/server'), filename: '[name].js'},

    module: {
      rules: [
        {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'},
        {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.(spec|e2e)\.ts$/]}
      ]
    },

    plugins: [
      new CleanWebpackPlugin(['build/dist/server'], {root: helpers.root('')}), new CheckerPlugin(),
      new webpack.DefinePlugin({'ENV': JSON.stringify(ENV)}),
      new webpack.optimize.OccurrenceOrderPlugin(true)
    ],

    node: {
      global: false,
      process: true,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
