var helpers = require('../../helpers');
var settings = require('../settings');

/* plugins */
var webpack = require('webpack');
var atl = require('awesome-typescript-loader');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');


module.exports = function(options) {
  if (!options) {
    options = {};
  }

  var ENV = process.env.ENV = process.env.NODE_ENV = options.dev ? 'development' : 'production';

  let config = {
    devtool: 'source-map',

    resolve: {extensions: ['.ts', '.js'], modules: [helpers.root('src/client'), 'node_modules']},

    entry: {
      polyfills: helpers.root('src/client/polyfills.ts'),
      vendor: helpers.root('src/client/vendor.ts'),
      boot: helpers.root('src/client/boot.ts')
    },

    output: {path: helpers.root('build/dist/client'), filename: '[name].[chunkhash].bundle.js'},

    module: {
      rules: [
        {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'}, {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          options: {'compilerOptions': {'removeComments': !options.dev}},
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        {test: /\.svg$/, loader: 'raw'}, {test: /\.css$/, loader: 'css?minimize'},
        {test: /\.json$/, loader: 'json-loader'}
      ]
    },

    plugins: [
      new webpack.DefinePlugin({'ENV': JSON.stringify(ENV)}),
      new webpack.optimize.CommonsChunkPlugin({name: ['vendor', 'polyfills']}),
      /*new webpack.optimize.DedupePlugin(), // TODO: add when webpack/webpack #2644 is fixed */
      new atl.ForkCheckerPlugin(), new atl.TsConfigPathsPlugin(),
      new CompressionPlugin({algorithm: 'gzip', test: /\.js$|\.html$/, threshold: 256}),
      new CopyWebpackPlugin([{from: 'src/client/assets/images', to: 'images'}]),
      new HtmlWebpackPlugin({
        template: 'src/client/index.html',
        title: 'Legend Builder' + options.dev ? ' [DEV]' : '',
        chunksSortMode: 'dependency',
        minify: options.dev ? false : {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeOptionalTags: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        baseUrl: '/',
        host: settings.httpServer.host,
        port: settings.httpServer.port,
        ENV: ENV
      }),
      new WebpackMd5Hash()
    ]
  };

  if (options.dev) {
    config.devServer = {
      port: settings.httpServer.port,
      host: settings.httpServer.host,
      historyApiFallback: true,
      outputPath: helpers.root('../build/dist/client'),
      watchOptions: {aggregateTimeout: 300, poll: 1000}
    }
  } else {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({beautify: false, mangle: true, comments: false}));
  }

  return config;
}
