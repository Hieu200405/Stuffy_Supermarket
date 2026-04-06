const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

// Auto-detect environment: use .env for local dev, fall back to process.env for Render deployment
// Helper to generate dynamic remote promise for Webpack Module Federation
const dynamicRemote = (name, envVar, defaultUrl) => `promise new Promise((resolve, reject) => {
  let retries = 0;
  const maxRetries = 5;
  const fetchConfig = () => {
    if (window._STUFFY_CONFIG_) {
      const url = window._STUFFY_CONFIG_['${envVar}'] || '${defaultUrl}';
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = \`\${url}/remoteEntry.js?t=\${new Date().getTime()}\`;
        script.onload = () => {
          resolve({
            get: (request) => window.${name}.get(request),
            init: (arg) => window.${name}.init(arg),
          });
        };
        script.onerror = () => {
          if (retries < maxRetries) {
            retries++;
            console.warn(\`Retrying to load remote ${name} (\${retries}/\${maxRetries})...\`);
            setTimeout(loadScript, 2000 * retries);
          } else {
            console.error(\`Failed to load remote ${name} after \${maxRetries} retries.\`);
            reject(new Error(\`Failed to load remote ${name}\`));
          }
        };
        document.head.appendChild(script);
      };
      loadScript();
    } else {
      setTimeout(fetchConfig, 50);
    }
  };
  fetchConfig();
})`;

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

      remotes: {
        header: dynamicRemote("header", "HEADER_URL", "https://stuffy-header-app.onrender.com"),
        product: dynamicRemote("product", "PRODUCT_URL", "https://stuffy-product-app.onrender.com"),
        cart: dynamicRemote("cart", "CART_URL", "https://stuffy-cart-app.onrender.com"),
        admin: dynamicRemote("admin", "ADMIN_URL", "https://stuffy-admin-app.onrender.com"),
        store: dynamicRemote("store", "STORE_URL", "https://stuffy-store-app.onrender.com"),
        design_system: dynamicRemote("design_system", "DESIGN_SYSTEM_URL", "https://stuffy-design-system-app.onrender.com"),
        viewer: dynamicRemote("viewer", "VIEWER_URL", "https://stuffy-3d-viewer-app.onrender.com"),
        profile: dynamicRemote("profile", "PROFILE_URL", "https://stuffy-profile-app.onrender.com"),
        marketing: dynamicRemote("marketing", "MARKETING_URL", "https://stuffy-marketing-app.onrender.com"),
        support: dynamicRemote("support", "SUPPORT_URL", "https://stuffy-support-app.onrender.com"),
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