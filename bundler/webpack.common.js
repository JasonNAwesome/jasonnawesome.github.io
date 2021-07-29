const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/d1.js'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../static'), to: '.'},
        { from: 'CNAME', to: '.'},
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html',
      minify: false
    }),
    new MiniCssExtractPlugin()
  ],
  output: {
    filename: 'hko.[contenthash].js',
    path: path.resolve(__dirname, '../docs'),
    clean: true,
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        // HTML
        test: /\.(html)$/,
        use: ['html-loader']
      },
      {
        // JS
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {presets: ['@babel/preset-react']}
        }
      },
      {
        // CSS
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        // PICS
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'static/images/'
          }
        }]
      },
      {
        // SHADERS
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader']
      },
      {
        // FONTS
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'static/fonts/'
          }
        }]
      }
    ]
  }
};