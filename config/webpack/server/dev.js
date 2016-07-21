var helpers = require('../../../helpers');
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

const METADATA = webpackMerge(commonConfig.metadata, {ENV: ENV});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',
  debug: true,
  target: 'node',

  entry: {
    'static-server': helpers.root('src/server/static/server.ts'),
    'match-server': helpers.root('src/server/match/server.ts'),
  },

  output: {path: helpers.root('dist/server'), filename: '[name].js'},

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
        // these packages have problems with their sourcemaps
        helpers.root('node_modules/rxjs'),
        helpers.root('node_modules/@angular'),
      ]
    }],

    loaders:
        [{test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.(spec|e2e)\.ts$/]}]
  },

  resolve: {extensions: ['', '.ts', '.js']},

  plugins: [
    new ForkCheckerPlugin(), new OccurrenceOrderPlugin(true),
    new DefinePlugin({'ENV': JSON.stringify(ENV)})
  ],

  node: {
    global: 'window',
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
