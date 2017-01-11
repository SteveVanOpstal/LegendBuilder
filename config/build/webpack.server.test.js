var glob = require('glob');

var helpers = require('../helpers');

/* plugins */
var CleanWebpackPlugin = require('clean-webpack-plugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {
  if (!options) {
    options = {};
  }

  return {
    target: 'node',
    devtool: 'source-map',

    resolve: {extensions: ['.ts', '.js'], modules: ['node_modules']},

    entry: glob.sync('./src/server/**/*.spec.ts'),

    output: {path: helpers.root('build/spec/server'), filename: '[name].spec.js'},

    module: {
      rules: [
        {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'},
        {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/]}, {
          test: /\.(js|ts)$/,
          enforce: 'post',
          loader: 'istanbul-instrumenter-loader',
          include: helpers.root('src/server'),
          exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, helpers.root('node_modules')]
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(['build/spec/server'], {root: helpers.root('')}),
      new DefinePlugin({'ENV': JSON.stringify(ENV)})
    ],

    node: {
      global: false,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
