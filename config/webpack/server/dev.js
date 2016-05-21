var helpers = require('../../../helpers');
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

const METADATA = webpackMerge(commonConfig.metadata, {
  ENV: ENV
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  debug: true,
  target: 'node',

  entry: {
    'static-server': './src/server/static-server.ts',
    'match-server': './src/server/match-server.ts'
  },

  output: {
    path: helpers.root('../dist/server'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  plugins: [
    new ForkCheckerPlugin(),
    new OccurenceOrderPlugin(true),
    new DefinePlugin({ 'ENV': JSON.stringify(ENV) })
  ]
});
