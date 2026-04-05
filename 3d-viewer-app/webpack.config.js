const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: { port: 3007, historyApiFallback: true },
  output: { publicPath: "auto" },
  module: {
    rules: [
      { test: /\.m?js$/, type: "javascript/auto", resolve: { fullySpecified: false } },
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  plugins: [
    new ModuleFederationPlugin({
      name: "viewer",
      filename: "remoteEntry.js",
      exposes: { "./Viewer": "./src/Viewer" },
      shared: { react: { singleton: true }, "react-dom": { singleton: true }, three: { singleton: true } },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
