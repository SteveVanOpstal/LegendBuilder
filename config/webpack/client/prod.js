var helpers = require('../../../helpers');
var settings = require('../../settings');
const common = require('../common');

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

module.exports = webpackMerge(common, {
  entry: {
    polyfills: helpers.root('src/client/polyfills.ts'),
    vendor: helpers.root('src/client/vendor.ts'),
    boot: helpers.root('src/client/boot.ts')
  },

  output: {path: helpers.root('build/dist/client'), filename: '[name].[chunkhash].bundle.js'},

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {'compilerOptions': {'removeComments': true}},
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {test: /\.svg$/, loader: 'raw'}, {test: /\.css$/, loader: 'css?minimize'}
    ]
  },

  plugins: [
    new ForkCheckerPlugin(), new OccurrenceOrderPlugin(true),
    new CommonsChunkPlugin({name: ['vendor', 'polyfills']}), new WebpackMd5Hash()
    /*new DedupePlugin() // TODO: add when webpack/webpack #2644 is fixed */,
    new CopyWebpackPlugin([{from: 'src/client/assets/images', to: 'images'}]),
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
      title: 'Legend Builder',
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      options: {
        baseUrl: '/',
        host: settings.httpServer.host,
        port: settings.httpServer.port,
        ENV: ENV
      }
    }),
    new DefinePlugin({'ENV': JSON.stringify(ENV)}),
    new UglifyJsPlugin({beautify: false, mangle: true, comments: false}),
    new CompressionPlugin({algorithm: 'gzip', regExp: /\.html$|\.js$/, threshold: 2 * 1024})
  ]
});
