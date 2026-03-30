const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "development",

  entry: "./src/index.js",

  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
  },

  experiments: {
    outputModule: false,
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",   // 🔥 QUAN TRỌNG
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "header",

      filename: "remoteEntry.js",

      exposes: {
        "./Header": "./src/Header",
      },

      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
      },
    }),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
    }),
  ],
};