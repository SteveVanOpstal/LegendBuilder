let helpers = require('../helpers');
let settings = require('../settings');
let pkg = require('../../package.json');

/* plugins */
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let {CheckerPlugin} = require('awesome-typescript-loader');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let WebpackMd5Hash = require('webpack-md5-hash');

module.exports = (options) => {
  if (!options) {
    options = {};
  }

  let ENV = process.env.ENV = process.env.NODE_ENV = 'production';

  let externals = {
    'webfontloader': {global: 'WebFont', path: ''},
    'core-js': {global: '', path: '/client/shim.min.js'},
    'zone.js': {global: 'Zone', path: '/dist/zone.min.js'},
    'reflect-metadata': {global: 'Reflect', path: ''},
    'rxjs': {global: 'Rx', path: '/bundles/Rx.min.js'},
    '@angular/core': {global: 'ng.core', path: '/bundles/core.umd.min.js'},
    '@angular/common': {global: 'ng.common', path: '/bundles/common.umd.min.js'},
    '@angular/compiler': {global: 'ng.compiler', path: '/bundles/compiler.umd.min.js'},
    '@angular/platform-browser':
        {global: 'ng.platformBrowser', path: '/bundles/platform-browser.umd.min.js'},
    '@angular/platform-browser-dynamic':
        {global: 'ng.platformBrowserDynamic', path: '/bundles/platform-browser-dynamic.umd.min.js'},
    '@angular/http': {global: 'ng.http', path: '/bundles/http.umd.min.js'},
    '@angular/router': {global: 'ng.router', path: '/bundles/router.umd.min.js'},
    'ng-pipes': {global: 'ng.pipes', path: '/dist/ng-pipes.umd.min.js'},
    'd3-path': {global: 'd3', path: '/build/d3-path.min.js'},
    'd3-format': {global: 'd3', path: '/build/d3-format.min.js'},
    'd3-array': {global: 'd3', path: '/build/d3-array.min.js'},
    'd3-color': {global: 'd3', path: '/build/d3-color.min.js'},
    'd3-interpolate': {global: 'd3', path: '/build/d3-interpolate.min.js'},
    'd3-axis': {global: 'd3', path: '/build/d3-axis.min.js'},
    'd3-scale': {global: 'd3', path: '/build/d3-scale.min.js'},
    'd3-selection': {global: 'd3', path: '/build/d3-selection.min.js'},
    'd3-shape': {global: 'd3', path: '/build/d3-shape.min.js'},
  };

  let dependencies = {};
  let globals = {};
  for (let name in externals) {
    let external = externals[name];
    dependencies[name] = 'https://unpkg.com/' + name + '@' + pkg.dependencies[name] + external.path;
    globals[name] = external.global;
  }

  let config = {
    devtool: 'source-map',

    resolve: {extensions: ['.ts', '.js'], modules: [helpers.root('src/client'), 'node_modules']},

    entry: {boot: helpers.root('src/client/boot.ts')},

    output: {
      path: helpers.root('build/dist/client'),
      filename: options.dev ? '[name].bundle.js' : '[name].[chunkhash].bundle.js'
    },

    externals: globals,

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
        host: settings.host,
        port: settings.port,
        ENV: ENV,
        version: pkg.version,
        dependencies: dependencies
      })
    ],

    performance: {hints: options.dev ? false : 'error'},

    devServer: {
      port: settings.port,
      host: settings.host,
      historyApiFallback: true,
      watchOptions: {aggregateTimeout: 300, poll: 1000},
      headers: {'Cache-Control': 'public, max-age=31536000'},
      proxy: {
        '/staticapi': {
          target: 'https://127.0.0.1:' + settings.static.port,
          pathRewrite: {'^/staticapi': ''},
          changeOrigin: true,
          secure: false
        },
        '/matchapi': {
          target: 'https://127.0.0.1:' + settings.match.port,
          pathRewrite: {'^/matchapi': ''},
          changeOrigin: true,
          secure: false
        }
      }
    }
  };

  if (!options.dev) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle: true}));
    config.plugins.push(new WebpackMd5Hash());
  }

  return config;
}
