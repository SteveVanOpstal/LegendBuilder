var helpers = require('../../../helpers');
var settings = require('../../settings').settings;
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

const METADATA = webpackMerge(commonConfig.metadata, {
  title: commonConfig.metadata.title + ' [DEV]',
  host: settings.httpServer.host || 'localhost',
  port: settings.httpServer.port || 8080,
  ENV: ENV
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',
  // cache: true,
  debug: true,

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/boot.ts'
  },

  output: {
    path: helpers.root('../dist/client'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular'),
        ]
      }
    ]
  },

  plugins: [
    new ForkCheckerPlugin(),
    new OccurenceOrderPlugin(true),
    new CommonsChunkPlugin({ name: ['app', 'vendor', 'polyfills'], minChunks: Infinity }),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new HtmlWebpackPlugin({ template: 'src/index.html', chunksSortMode: 'none' }),
    new DefinePlugin({ 'ENV': JSON.stringify(ENV) })
  ],

  devServer: {
    port: METADATA.port,
    host: METADATA.host,
    historyApiFallback: true,
    outputPath: helpers.root('../dist/client'),
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
});
