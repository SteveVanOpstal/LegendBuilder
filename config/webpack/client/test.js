var helpers = require('../../../helpers');
const common = require('../common');

const webpackMerge = require('webpack-merge');

/* plugins */
var DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = webpackMerge(common, {
  devtool: 'inline-source-map',

  module: {
    rules: [
      {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: [/\.e2e\.ts$/]},
      {test: /\.css|.svg$/, loader: 'raw'}, {
        test: /\.(js|ts)$/,
        enforce: 'post',
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src/client'),
        exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, helpers.root('node_modules')]
      }
    ]
  },

  plugins: [new DefinePlugin({'ENV': JSON.stringify(ENV)})]
});
