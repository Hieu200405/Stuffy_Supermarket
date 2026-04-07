import { loadMfeManifest, injectRemoteScript } from "./utils/mfe-orchestrator";

// 🚀 GOVERNANCE ORCHESTRATION: Load MFEs at Runtime from Registry
async function orchestrate() {
  console.log("[Orchestrator] Initializing Governance...");
  
  const manifest = await loadMfeManifest();
  const remoteInjections = [];
  
  // 🏦 DYNAMIC REGISTRY: Inject every remote listed in the manifest
  for (const [name, url] of Object.entries(manifest)) {
    remoteInjections.push(injectRemoteScript(name, url));
  }
  
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