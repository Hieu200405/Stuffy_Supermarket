import { loadMfeManifest, injectRemoteScript } from "./utils/mfe-orchestrator";

// 🚀 GOVERNANCE ORCHESTRATION: Load MFEs at Runtime from Registry
async function orchestrate() {
  console.log("[Orchestrator] Initializing Governance...");
  
  const manifest = await loadMfeManifest();
  const remoteInjections = [];
  
  if (manifest.store) remoteInjections.push(injectRemoteScript("store", manifest.store));
  if (manifest.header) remoteInjections.push(injectRemoteScript("header", manifest.header));
  if (manifest.product) remoteInjections.push(injectRemoteScript("product", manifest.product));
  
  await Promise.all(remoteInjections);
  
  console.log("[Orchestrator] All governance rules applied. Bootstrapping app...");
  import("./bootstrap");
}

orchestrate();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch(err => console.error('[PWA] SW registration failed:', err));
  });
}