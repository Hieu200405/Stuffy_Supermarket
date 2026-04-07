/**
 * Image Optimization Helper
 * Dynamic Resize + WebP Conversion
 */
export const getOptimizedImage = (url, width = 800, quality = 80) => {
    if (!url) return '';
    // Use the Resilient Backend Proxy (with Circuit Breaker)
    const SERVICE_URL = 'https://stuffy-backend-api.onrender.com/api/images/proxy';
    return `${SERVICE_URL}?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
};
