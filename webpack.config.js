const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  devServer: {
    contentBase: './dist',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: 'index.html',
    }),
    new CopyPlugin([{
        from: 'assets',
        to: 'assets',
        context: 'src',
        force: true,
    }]),
  ],
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};