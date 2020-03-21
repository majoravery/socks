const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
  }),
  new HtmlWebpackPlugin({
    title: 'Magbelle Pay Slip App',
    template: './public/index.html',
  })
];
const optimization = {
  minimize: isProduction,
  minimizer: [new TerserPlugin()],
}

if (isProduction) {
  plugins.push()
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = {
  entry: './src/index.js',
  mode: isProduction ? 'production' : 'none',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  optimization,
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 3013,
    historyApiFallback: true,
    quiet: true,
  }
};