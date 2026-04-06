const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "production", // Default to production for build
  entry: "./src/index.js",
  devServer: { port: 3007, historyApiFallback: true },
  output: { publicPath: "auto" },
  stats: { errorDetails: true }, // Added for better debug
  module: {
    rules: [
      { test: /\.m?js$/, type: "javascript/auto", resolve: { fullySpecified: false } },
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|svg|jpg|jpeg|gif|glb|gltf|bin)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      // Use require.resolve to find the actual location of 'three' in a monorepo
      three: path.dirname(require.resolve("three/package.json")),
    },
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../node_modules"),
      "node_modules",
    ],
  },
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
