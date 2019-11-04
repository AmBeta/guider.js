const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    './demo/demo.scss',
    './demo/demo.js',
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: './',
    filename: 'guider-demo.min.js',
  },
  resolve: {
    alias: {
      guider: path.join(__dirname, '../src'),
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      enforce: 'pre',
      options: {
        failOnWarning: false,
        failOnError: true,
      },
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /.scss$/,
      loader: ExtractTextPlugin.extract([
        {
          loader: 'css-loader',
          options: { url: false },
        },
        'sass-loader',
      ]),
    }],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'guider-demo.min.css',
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
      // eslint-disable-next-line global-require
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
      canPrint: true,
    }),
    new HtmlWebpackPlugin({
      template: 'demo/index.html',
      favicon: 'demo/favicon.ico',
    }),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
