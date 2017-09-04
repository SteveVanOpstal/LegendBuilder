let glob = require('glob');
let helpers = require('../helpers');
let DefinePlugin = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = (options) => {
  if (!options) {
    options = {};
  }

  return {
    target: 'node',
    devtool: 'source-map',

    resolve: {extensions: ['.ts', '.js'], modules: ['node_modules']},

    entry: glob.sync('./src/server/**/*.spec.ts'),

    output: {path: helpers.root('build/spec/server'), filename: '[name].spec.js'},

    module: {
      rules: [
        {test: /\.js$/, enforce: 'pre', loader: 'source-map-loader'}, {
          test: /\.ts$/,
          loader: '@ngtools/webpack',
          exclude: [/\.e2e\.ts$/],
          options: {tsConfigPath: './tsconfig.json'}
        },
        {
          test: /\.(js|ts)$/,
          enforce: 'post',
          loader: 'istanbul-instrumenter-loader',
          include: helpers.root('src/server'),
          exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, helpers.root('node_modules')]
        }
      ]
    },

    plugins: [new DefinePlugin({'ENV': JSON.stringify(ENV)})],

    node: {
      global: false,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
