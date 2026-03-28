const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const webpack = require("webpack");
require("dotenv").config(); // Nạp đạn Biến Môi Trường

// Động cơ tự động gài số: Nếu chạy máy tính thì lấy file .env (Localhost), nếu đẩy lên mạng (Render) thì tự lấy đường link của Render
const getUrl = (envVar, defaultUrl) => process.env[envVar] || defaultUrl;

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
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: { extensions: [".js", ".jsx"] },

  plugins: [
    new ModuleFederationPlugin({
      name: "container",

      remotes: {
        header: `header@${getUrl('HEADER_URL', 'https://stuffy-header-app.onrender.com')}/remoteEntry.js`,
        product: `product@${getUrl('PRODUCT_URL', 'https://stuffy-product-app.onrender.com')}/remoteEntry.js`,
        cart: `cart@${getUrl('CART_URL', 'https://stuffy-cart-app.onrender.com')}/remoteEntry.js`,
        admin: `admin@${getUrl('ADMIN_URL', 'https://stuffy-admin-app.onrender.com')}/remoteEntry.js`,
        store: `store@${getUrl('STORE_URL', 'https://stuffy-store-app.onrender.com')}/remoteEntry.js`,
        design_system: `design_system@${getUrl('DESIGN_SYSTEM_URL', 'https://stuffy-design-system-app.onrender.com')}/remoteEntry.js`,
      },

      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
        zustand: { singleton: true, requiredVersion: false },
      },
    }),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};