const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  mode: 'development',
  entry: './example/index.tsx',
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: "/node_modules/"
      },
      {
        enforce: "pre",
        test: /\.tsx?$/,
        use: "source-map-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true
            }
          }
        ],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './example/index.html'
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  ]
};