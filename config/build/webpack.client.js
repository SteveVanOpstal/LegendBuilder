var helpers = require('../helpers');
var settings = require('../settings');
var package = require('../../package.json');

/* plugins */
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var {CheckerPlugin} = require('awesome-typescript-loader');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = (options) => {
  if (!options) {
    options = {};
  }

  var ENV = process.env.ENV = process.env.NODE_ENV = options.dev ? 'development' : 'production';

  let config = {
    devtool: 'source-map',

    resolve: {extensions: ['.ts', '.js'], modules: [helpers.root('src/client'), 'node_modules']},

    entry: {boot: helpers.root('src/client/boot.ts')},

    output: {
      path: helpers.root('build/dist/client'),
      filename: options.dev ? '[name].bundle.js' : '[name].[chunkhash].bundle.js'
    },

    externals: {
      '@angular/common': 'ng.common',
      '@angular/compiler': 'ng.compiler',
      '@angular/core': 'ng.core',
      '@angular/http': 'ng.http',
      '@angular/platform-browser': 'ng.platformBrowser',
      '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
      '@angular/router': 'ng.router',
      'd3-array': 'd3',
      'd3-axis': 'd3',
      'd3-scale': 'd3',
      'd3-selection': 'd3',
      'd3-shape': 'd3',
      'd3-format': 'd3',
      'ng-pipes': 'ng.pipes',
      'rxjs/Rx': 'Rx',
      'zone.js': 'Zone',
      'core-js': '',
      'reflect-metadata': 'Reflect'
    },

    module: {
      rules: [
        {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'}, {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          options: {compilerOptions: {removeComments: !options.dev}, silent: options.profile},
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        {test: /\.svg$/, loader: ['raw-loader', 'svgo-loader']},
        {test: /\.css$/, loader: 'css-loader?minimize'}, {test: /\.json$/, loader: 'json-loader'}
      ]
    },

    plugins: [
      new CleanWebpackPlugin(
          options.profile || options.server ? [] : ['build/dist/client'], {root: helpers.root()}),
      new webpack.DefinePlugin({'ENV': JSON.stringify(ENV)}), new CheckerPlugin(),
      new CompressionPlugin({algorithm: 'gzip', test: /\.(js|html)$/, threshold: 256}),
      new CopyWebpackPlugin([{from: 'src/client/assets/images/favicon.ico', to: 'favicon.ico'}]),
      new CopyWebpackPlugin([{from: 'src/client/assets/images/logo.svg', to: 'logo.svg'}]),
      new CopyWebpackPlugin(
          [{from: 'src/client/manifest.webmanifest', to: 'manifest.webmanifest'}]),
      new HtmlWebpackPlugin({
        template: 'src/client/index.ejs',
        title: 'Legend Builder' + (options.dev ? ' [DEV]' : ''),
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
        ENV: ENV,
        version: package.version,
        dependencies: package.dependencies
      })
    ],

    performance: {hints: !options.dev},

    devServer: {
      port: settings.httpServer.port,
      host: settings.httpServer.host,
      historyApiFallback: true,
      watchOptions: {aggregateTimeout: 300, poll: 1000},
      headers: {'Cache-Control': 'public, max-age=31536000'}
    }
  };

  if (!options.dev) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle: true}));
    config.plugins.push(new WebpackMd5Hash());
  }

  return config;
}
