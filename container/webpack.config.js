const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

// Auto-detect environment: use .env for local dev, fall back to process.env for Render deployment
// Helper to generate dynamic remote promise for Webpack Module Federation
module.exports = {
  mode: "development",
  entry: "./src/index.js",

  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
  },

  output: {
    publicPath: "auto",
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: { transpileOnly: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },

  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remoteType: "var",
      remotes: {
        header: "header",
        product: "product",
        cart: "cart",
        admin: "admin",
        store: "store",
        design_system: "design_system",
        viewer: "viewer",
        profile: "profile",
        marketing: "marketing",
        support: "support",
      },

      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
        "react-router-dom": { singleton: true, requiredVersion: false },
        zustand: { singleton: true, requiredVersion: false },
      },
    }),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/config.json", to: "." },
        { from: "public/favicon.ico", to: ".", noErrorOnMissing: true },
      ],
    }),

    // PWA: Generate Service Worker
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 50 },
          },
        },
        {
          urlPattern: /https:\/\/stuffy-backend-api.onrender.com\/api/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
          },
        }
      ]
    }),
  ],
};