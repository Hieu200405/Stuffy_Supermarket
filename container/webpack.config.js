const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

// Auto-detect environment: use .env for local dev, fall back to process.env for Render deployment
// Helper to generate dynamic remote promise for Webpack Module Federation
// Helper to generate dynamic remote promise for Webpack Module Federation
const dynamicRemote = (name, envVar, defaultUrl, localPort) => `promise new Promise((resolve, reject) => {
  let retries = 0;
  const maxRetries = 10;
  const fetchConfig = () => {
    if (window._STUFFY_CONFIG_) {
      const remoteUrl = window._STUFFY_CONFIG_['${envVar}'] || '${defaultUrl}';
      const loadScript = (url, isFallback = false) => {
        const script = document.createElement('script');
        script.src = \`\${url}/remoteEntry.js?t=\${new Date().getTime()}\`;
        script.onload = () => {
          console.log(\`[ModuleFederation] \${name} loaded successfully from \${url}\`);
          resolve({
            get: (request) => window.${name}.get(request),
            init: (arg) => window.${name}.init(arg),
          });
        };
        script.onerror = () => {
          if (!isFallback && retries < maxRetries) {
            retries++;
            const delay = 2000 + (retries * 1000);
            console.warn(\`[ModuleFederation] Retrying \${name} (\${retries}/\${maxRetries}) from \${url} in \${delay}ms...\`);
            setTimeout(() => loadScript(url), delay);
          } else if (!isFallback && window.location.hostname === 'localhost' && ${localPort}) {
            const localUrl = \`http://localhost:${localPort}\`;
            console.error(\`[ModuleFederation] Failed to load \${name} from \${url}. Falling back to LOCALHOST: \${localUrl}\`);
            loadScript(localUrl, true);
          } else {
            console.error(\`[ModuleFederation] CRITICAL: Failed to load \${name} after \${maxRetries} retries at \${url}\`);
            reject(new Error(\`Failed to load remote \${name}\`));
          }
        };
        document.head.appendChild(script);
      };
      loadScript(remoteUrl);
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
        header: dynamicRemote("header", "HEADER_URL", "https://stuffy-header-app.onrender.com", 3001),
        product: dynamicRemote("product", "PRODUCT_URL", "https://stuffy-product-app.onrender.com", 3002),
        cart: dynamicRemote("cart", "CART_URL", "https://stuffy-cart-app.onrender.com", 3003),
        admin: dynamicRemote("admin", "ADMIN_URL", "https://stuffy-admin-app.onrender.com", 3004),
        store: dynamicRemote("store", "STORE_URL", "https://stuffy-store-app.onrender.com", 3005),
        design_system: dynamicRemote("design_system", "DESIGN_SYSTEM_URL", "https://stuffy-design-system-app.onrender.com", 3006),
        viewer: dynamicRemote("viewer", "VIEWER_URL", "https://stuffy-3d-viewer-app.onrender.com", 3007),
        profile: dynamicRemote("profile", "PROFILE_URL", "https://stuffy-profile-app.onrender.com", 3008),
        marketing: dynamicRemote("marketing", "MARKETING_URL", "https://stuffy-marketing-app.onrender.com", 3009),
        support: dynamicRemote("support", "SUPPORT_URL", "https://stuffy-support-app.onrender.com", 3010),
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