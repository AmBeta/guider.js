const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.scss',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/../lib'),
    publicPath: '/lib/',
    filename: 'guider.min.js',
    libraryTarget: 'umd',
    library: 'TutorialRunner',
    libraryExport: 'default',
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
      filename: 'guider.min.css',
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
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-source-map',
};
