var helpers = require('./helpers');
var glob = require('glob');

var DefinePlugin = require('webpack/lib/DefinePlugin');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
  devtool: 'source-map',

  entry: glob.sync("./src/server/**/*.spec.ts"),

  output: {
    path: helpers.root('spec'),
    filename: '[name].spec.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    preLoaders: [
      { test: /\.spec.ts$/, loader: 'tslint-loader', exclude: [helpers.root('node_modules')] },
      { test: /\.js$/, loader: "source-map-loader", exclude: [helpers.root('node_modules/rxjs')] }
    ],

    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          "compilerOptions": {
            "removeComments": true
          }
        },
        exclude: [/\.e2e\.ts$/]
      }
    ],

    postLoaders: [
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.e2e\.ts$/,
          /\.spec\.ts$/,
          helpers.root('node_modules')
        ]
      }
    ]
  },

  plugins: [
    new DefinePlugin({ 'ENV': JSON.stringify(ENV) })
  ],

  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src'
  },

  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
