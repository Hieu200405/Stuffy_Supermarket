/**
 * MFE ORCHESTRATOR & DYNAMIC REGISTRY LOADER
 * Objective: Load remotes at Runtime based on the Governance Manifest.
 */

export const loadMfeManifest = async () => {
    try {
        const res = await fetch("https://stuffy-backend-api.onrender.com/api/registry/manifest");
        const manifest = await res.json();
        return manifest;
    } catch (err) {
        console.error("[Orchestrator] Failed to fetch MFE Manifest, falling back to defaults.", err);
        return {
            store: "https://stuffy-store-app.onrender.com/remoteEntry.js",
            header: "https://stuffy-header-app.onrender.com/remoteEntry.js",
            product: "https://stuffy-product-app.onrender.com/remoteEntry.js"
        };
    }
};

/**
 * Injects a remote script into the document if not already present.
 */
export const injectRemoteScript = (name, url) => {
    return new Promise((resolve, reject) => {
        if (window[name]) return resolve(); // Already loaded

        const script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";
        script.async = true;

        script.onload = () => {
            console.log(`[Orchestrator] ✅ MFE '${name}' successfully injected from ${url}`);
            resolve();
        };

        script.onerror = () => {
            console.error(`[Orchestrator] ❌ Failed to load script for MFE '${name}' from ${url}`);
            reject();
        };

        document.head.appendChild(script);
    });
};
