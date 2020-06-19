// generated by @ng-toolkit/serverless
// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: {
      server: './server-lambda.js'
    },
    target: 'node',
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname),
      filename: '[name]-packed.js'
    },
    module: {
      rules: [
      ]
    },
    optimization: {
      minimize: false
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        // fixes WARNING Critical dependency: the request of a dependency is an expression
        /(.+)?express(\\|\/)(.+)?/,
        path.join(__dirname, 'src'),
        {}
      )
    ]
  };
};
