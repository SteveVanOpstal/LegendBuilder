var helpers = require('./helpers');

var webpack = require('webpack');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var metadata = {
  title: 'Legend Builder',
  baseUrl: '/',
  ENV: ENV
};

module.exports = {
  metadata: metadata,
  debug: true,
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
      { test: /\.ts$/, loader: 'tslint-loader', exclude: [helpers.root('node_modules')] },
    ],
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/] },
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.DefinePlugin({ 'ENV': JSON.stringify(metadata.ENV) })
  ],

  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src',
  }
  // node: {
  //   global: 'window',
  //   process: true,
  //   crypto: 'empty',
  //   module: false,
  //   clearImmediate: false,
  //   setImmediate: false
  // }
};
