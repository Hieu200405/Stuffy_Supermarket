/**
 * ELITE MFE PRELOADER
 * Purpose: Preload remoteEntry.js files for dynamic remotes 
 * based on user intent (Hover, Route anticipation).
 */

const preloadedRemotes = new Set();

export const prefetchRemote = (name, url) => {
  if (preloadedRemotes.has(name)) return;
  
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  script.onload = () => {
    console.log(`[Prefetch] ✅ Remote "${name}" is now hot and ready for 0ms transition.`);
    preloadedRemotes.add(name);
  };
  
  document.head.appendChild(script);
};

// Map of remotes and their entry points (Cloud-Sync)
export const REMOTE_MAP = {
  header: "https://stuffy-header-app.onrender.com/remoteEntry.js",
  product: "https://stuffy-product-app.onrender.com/remoteEntry.js",
  cart: "https://stuffy-cart-app.onrender.com/remoteEntry.js",
  admin: "https://stuffy-admin-app.onrender.com/remoteEntry.js",
  store: "https://stuffy-store-app.onrender.com/remoteEntry.js",
  profile: "https://stuffy-profile-app.onrender.com/remoteEntry.js",
  marketing: "https://stuffy-marketing-app.onrender.com/remoteEntry.js",
  support: "https://stuffy-support-app.onrender.com/remoteEntry.js",
  design_system: "https://stuffy-design-system-app.onrender.com/remoteEntry.js",
  viewer: "https://stuffy-3d-viewer-app.onrender.com/remoteEntry.js",
};
