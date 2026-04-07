/**
 * STUFFY STORE: EDGE-SIDE RENDERING (ESR) GATEWAY
 * Built for Cloudflare Workers / Vercel Edge
 * 
 * Objective: Pre-render and Stitch MFEs at the Edge to reduce FCP.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Fetch the main Shell (Container) HTML
    // (Assuming our shell is deployed on Render or elsewhere)
    const shellUrl = "https://stuffy-supermarket-shell.onrender.com";
    const shellResponse = await fetch(shellUrl + url.pathname);
    
    if (!shellResponse.ok || !shellResponse.headers.get("content-type")?.includes("text/html")) {
      return shellResponse;
    }

    let html = await shellResponse.text();

    /** 
     * 🛰️ ELITE ESR STITCHING LOGIC - Parallel Prefetching
     * We can fetch fragments from MFEs concurrently at the edge.
     */
    const [headerRemote, marketingRemote, storeRemote] = await Promise.all([
      fetch("https://stuffy-header-app.onrender.com/remoteEntry.js").then(r => r.url),
      fetch("https://stuffy-marketing-app.onrender.com/remoteEntry.js").then(r => r.url),
      fetch("https://stuffy-store-app.onrender.com/remoteEntry.js").then(r => r.url),
    ]);

    /**
     * 💉 ELITE INJECTION: Instead of waiting for client JS to parse, 
     * we inject the <link rel="preload"> or <script> tags directly 
     * in the HEAD at the CDN level.
     */
    const preloads = `
      <link rel="modulepreload" href="${headerRemote}">
      <link rel="modulepreload" href="${marketingRemote}">
      <link rel="modulepreload" href="${storeRemote}">
      <script>window.__STUFFY_ESR_READY__ = true;</script>
    `;

    // Inject into the HTML head
    html = html.replace('</head>', `${preloads}</head>`);

    // Advanced: We could also replace placeholders with SSR fragments if they existed
    // html = html.replace('<!-- MFE:Header -->', await fetchHeaderFragment());

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "x-edge-stitched": "true",
        "cache-control": "public, max-age=60" // Cache the stitched result at the edge
      },
    });
  },
};
