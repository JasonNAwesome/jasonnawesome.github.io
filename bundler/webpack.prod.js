const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const { plugins } = require('./webpack.common.js');
//const TerserWebpackPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          format: {
            comments:false,
          },
        },
      }),
    ],
  },
  //devtool: 'source-map',
  /*plugins: [
    new TerserWebpackPlugin({
      terserOptions: {
        compress: { comparisons: true },
        mangle: { safari10: true },
        output: { comments: false },
      }
    })
  ]*/
  },
);