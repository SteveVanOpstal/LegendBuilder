let helpers = require('../helpers');

/* plugins */
let DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
  devtool: 'inline-source-map',

  entry: helpers.root('/config/karma-test-shim.js'),

  resolve: {extensions: ['.ts', '.js'], modules: ['node_modules']},

  module: {
    rules: [
      {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/]},
      {test: /\.css|.svg$/, loader: 'raw-loader'}, {
        test: /\.(js|ts)$/,
        enforce: 'post',
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src/client'),
        exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, helpers.root('node_modules')]
      }
    ]
  },

  plugins: [new DefinePlugin({'ENV': JSON.stringify(ENV)})]
}
