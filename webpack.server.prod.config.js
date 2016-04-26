var helpers = require('./helpers');

var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var ENV = process.env.NODE_ENV = process.env.ENV = 'production';

var metadata = {
  title: 'Legend Builder',
  baseUrl: '/',
  ENV: ENV
};

module.exports = {
  metadata: metadata,
  debug: false,
  target: 'node',

  entry: {
    'static-server': './src/server/static-server.ts',
    'match-server': './src/server/match-server.ts'
  },

  output: {
    path: helpers.root('dist/server'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    preLoaders: [
      { test: /\.ts$/, loader: 'tslint-loader', exclude: [helpers.root('node_modules')] }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          'compilerOptions': {
            'removeComments': true
          }
        },
        exclude: [/\.e2e\.ts$/]
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),
    new DedupePlugin(),
    new OccurenceOrderPlugin(true),
    new DefinePlugin({ 'ENV': JSON.stringify(metadata.ENV) })
  ],

  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src'
  }
};
