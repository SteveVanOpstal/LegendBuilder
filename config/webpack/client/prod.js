var helpers = require('../../../helpers');
var settings = require('../../settings').settings;
const commonConfig = require('../common.js');

const webpackMerge = require('webpack-merge');

/* plugins */
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var CompressionPlugin = require('compression-webpack-plugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'production';

const METADATA = webpackMerge(commonConfig.metadata, {
  host: settings.httpServer.host || 'localhost',
  port: settings.httpServer.port || 8080,
  ENV: ENV
});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',
  debug: false,

  entry: {
    polyfills: helpers.root('src/client/polyfills.ts'),
    vendor: helpers.root('src/client/vendor.ts'),
    boot: helpers.root('src/client/boot.ts')
  },

  output: {
    path: helpers.root('build/dist/client'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {'compilerOptions': {'removeComments': true}},
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {test: /\.css$/, loader: 'raw-loader'}
    ]
  },

  plugins: [
    new ForkCheckerPlugin(), new OccurrenceOrderPlugin(true),
    new CommonsChunkPlugin({name: ['vendor', 'polyfills']}), new WebpackMd5Hash(),
    new DedupePlugin(), new CopyWebpackPlugin([{from: 'src/assets/images', to: 'assets/images'}]),
    new HtmlWebpackPlugin({template: 'src/client/index.html', chunksSortMode: 'dependency'}),
    new DefinePlugin({'ENV': JSON.stringify(ENV)}),
    new UglifyJsPlugin({beautify: false, mangle: {keep_fnames: true}, comments: false}),
    new CompressionPlugin(
        {algorithm: 'gzip', regExp: /\.css$|\.html$|\.js$|\.map$/, threshold: 2 * 1024})
  ]
});
