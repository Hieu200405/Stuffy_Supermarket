/**
 * Image Optimization Helper
 * Dynamic Resize + WebP Conversion
 */
export const getOptimizedImage = (url, width = 800, quality = 80) => {
    if (!url) return '';
    // Use the Image Optimization Microservice
    const SERVICE_URL = 'http://localhost:3009/optimize';
    return `${SERVICE_URL}?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
};
