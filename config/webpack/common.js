const webpack = require('webpack');
const helpers = require('../../helpers');

var DefinePlugin = require('webpack/lib/DefinePlugin');

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
  
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      }
    ]
  }
};
