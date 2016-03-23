var webpack = require('webpack');
var helpers = require('./helpers');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
var settings = require('./src/server/settings').settings;

var metadata = {
  title: 'Legend Builder',
  baseUrl: '/',
  host: settings.httpServer.host || "localhost",
  port: settings.httpServer.port || 8080,
  ENV: ENV
};

module.exports = {
  metadata: metadata,
  devtool: 'source-map',
  // cache: true,
  debug: true,

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/boot.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  output: {
    path: helpers.root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    preLoaders: [
      { test: /\.ts$/, loader: 'tslint-loader', exclude: [helpers.root('node_modules')] },
      { test: /\.js$/, loader: 'source-map-loader' }
    ],
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/] },
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor', 'polyfills'], minChunks: Infinity }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new HtmlWebpackPlugin({ template: 'src/index.html', chunksSortMode: 'none' }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(metadata.ENV)
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src',
  },
  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  node: {
    global: 'window',
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
