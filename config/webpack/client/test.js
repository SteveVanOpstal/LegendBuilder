var helpers = require('../../../helpers');
const commonConfig = require('../common.js');

var glob = require('glob');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const METADATA = webpackMerge(commonConfig.metadata, {ENV: ENV});

module.exports = webpackMerge(commonConfig, {
  metadata: METADATA,
  devtool: 'source-map',

  entry: {main: ['./config/spec-imports'].concat(glob.sync('./src/client/**/*.spec.ts'))},

  output: {path: helpers.root('dist/spec/client'), filename: '[name].spec.js'},

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
      {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/]},
      {test: /\.css$/, loader: 'raw-loader'}
    ],

    postLoaders: [{
      test: /\.(js|ts)$/,
      loader: 'istanbul-instrumenter-loader',
      include: helpers.root('src/client'),
      exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, helpers.root('node_modules')]
    }]
  },

  plugins: [new DefinePlugin({'ENV': JSON.stringify(ENV)})]
});
