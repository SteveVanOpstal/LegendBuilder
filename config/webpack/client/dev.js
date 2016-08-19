var helpers = require('../../../helpers');
var settings = require('../../settings').settings;
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
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
    polyfills: helpers.root('src/client/polyfills.ts'),
    vendor: helpers.root('src/client/vendor.ts'),
    boot: helpers.root('src/client/boot.ts')
  },

  output: {
    path: helpers.root('build/dist/client'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[id].chunk.js'
  },

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

    loaders: [
      {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.(spec|e2e)\.ts$/]},
      {test: /\.css|.svg$/, loader: 'raw-loader'}
    ]
  },

  plugins: [
    new ForkCheckerPlugin(), new OccurrenceOrderPlugin(true),
    new CommonsChunkPlugin({name: ['vendor', 'polyfills']}),
    new CopyWebpackPlugin([{from: 'src/client/assets/images', to: 'images'}]),
    new CopyWebpackPlugin([{from: 'src/client/base.css', to: 'base.css'}]),
    new HtmlWebpackPlugin({template: 'src/client/index.html', chunksSortMode: 'dependency'}),
    new DefinePlugin({'ENV': JSON.stringify(ENV)})
  ],

  devServer: {
    port: METADATA.port,
    host: METADATA.host,
    historyApiFallback: true,
    outputPath: helpers.root('../build/dist/client'),
    watchOptions: {aggregateTimeout: 300, poll: 1000}
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
