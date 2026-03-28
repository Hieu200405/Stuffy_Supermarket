const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./src/index.js",

  devServer: {
    port: 3003,
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
      name: "cart",
      filename: "remoteEntry.js",

      remotes: {
        store: "store@http://localhost:3005/remoteEntry.js",
        design_system: "design_system@http://localhost:3006/remoteEntry.js",
      },

      exposes: {
        "./Cart": "./src/components/Cart",
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
