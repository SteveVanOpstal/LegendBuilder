var helpers = require('../../../helpers');
const common = require('../common');

var glob = require('glob');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = webpackMerge(common, {
  target: 'node',
  devtool: 'source-map',

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

  plugins: [new DefinePlugin({'ENV': JSON.stringify(ENV)})],

  node: {
    global: false,
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
