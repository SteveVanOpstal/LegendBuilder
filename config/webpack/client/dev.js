var helpers = require('../../../helpers');
const settings = require('../../settings');
const common = require('../common');

const webpackMerge = require('webpack-merge');

/* plugins */
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = webpackMerge(common, {
  devtool: 'source-map',
  cache: true,

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
    rules: [
      {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'},
      {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.(spec|e2e)\.ts$/]},
      {test: /\.svg$/, loader: 'raw'}, {test: /\.css$/, loader: 'css?minimize'}
    ]
  },

  plugins: [
    new ForkCheckerPlugin(), new OccurrenceOrderPlugin(true),
    new CommonsChunkPlugin({name: ['vendor', 'polyfills']}),
    new CopyWebpackPlugin([{from: 'src/client/assets/images', to: 'images'}]),
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
      title: 'Legend Builder [DEV]',
      chunksSortMode: 'dependency',
      ENV: ENV,
      baseUrl: '/',
      host: settings.httpServer.host,
      port: settings.httpServer.port
    }),
    new DefinePlugin({'ENV': JSON.stringify(ENV)})
  ],

  devServer: {
    port: settings.httpServer.port,
    host: settings.httpServer.host,
    historyApiFallback: true,
    outputPath: helpers.root('../build/dist/client'),
    watchOptions: {aggregateTimeout: 300, poll: 1000}
  }
});
