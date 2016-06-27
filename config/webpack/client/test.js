var helpers = require('../../../helpers');
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

const METADATA = webpackMerge(commonConfig.metadata, {
  ENV: ENV
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.e2e\.ts$/]
      }
    ],

    postLoaders: [
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src/client'),
        exclude: [
          /\.e2e\.ts$/,
          /\.spec\.ts$/,
          helpers.root('node_modules')
        ]
      }
    ]
  },

  plugins: [
    new DefinePlugin({ 'ENV': JSON.stringify(ENV) })
  ],

  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
