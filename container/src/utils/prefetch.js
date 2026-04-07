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

// Map of remotes and their entry points
export const REMOTE_MAP = {
  cart: "http://localhost:3003/remoteEntry.js",
  admin: "http://localhost:3004/remoteEntry.js",
  profile: "http://localhost:3007/remoteEntry.js",
  product: "http://localhost:3002/remoteEntry.js",
  support: "http://localhost:3008/remoteEntry.js"
};
