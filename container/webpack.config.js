const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

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
      name: "container",

      remotes: {
        header: "header@https://stuffy-header-app.onrender.com/remoteEntry.js",
        product: "product@https://stuffy-product-app.onrender.com/remoteEntry.js",
        cart: "cart@https://stuffy-cart-app.onrender.com/remoteEntry.js",
        admin: "admin@https://stuffy-admin-app.onrender.com/remoteEntry.js",
        store: "store@https://stuffy-store-app.onrender.com/remoteEntry.js",
        design_system: "design_system@https://stuffy-design-system-app.onrender.com/remoteEntry.js",
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