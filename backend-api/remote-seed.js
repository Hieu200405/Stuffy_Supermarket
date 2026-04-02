const vipProducts = [
  { name: "MacBook Pro M3 Max",        price: 3499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
  { name: "Apple Vision Pro",           price: 3499, image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
  { name: "Sony WH-1000XM5",           price: 398,  image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
  { name: "PlayStation 5",             price: 499,  image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80" },
  { name: "Keychron Q1 Pro",           price: 199,  image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { name: "Logitech MX Master 3S",     price: 99,   image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
  { name: "GoPro Hero 12",             price: 399,  image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80" },
  { name: "Marshall Stanmore III",     price: 379,  image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80" }
];

async function seedRemote() {
  const baseURL = 'https://stuffy-backend-api.onrender.com/api/products';
  
  try {
    console.log('[RemoteSeed] Connecting to remote API:', baseURL);
    const res = await fetch(baseURL);
    const currentProducts = await res.json();
    
    if (!Array.isArray(currentProducts)) {
      console.error('[RemoteSeed] Unexpected API response (expected array). Backend may not be connected to MongoDB Atlas:', currentProducts);
      console.error('[RemoteSeed] Ensure MONGO_URI is set in Render environment variables and the service has redeployed.');
      return;
    }
    
    console.log(`[RemoteSeed] Found ${currentProducts.length} existing products. Clearing...`);
    for (const p of currentProducts) {
      if (p.id) {
         await fetch(`${baseURL}/${p.id}`, { method: 'DELETE' });
         console.log(`[RemoteSeed] Deleted product: ${p.id}`);
      }
    }
    
    console.log('[RemoteSeed] Inserting new products...');
    for (const newP of vipProducts) {
      await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newP)
      });
      console.log(`[RemoteSeed] Inserted: ${newP.name}`);
    }
    
    console.log('[RemoteSeed] Done. All products have been seeded successfully.');
  } catch (error) {
    console.error('[RemoteSeed] Seed operation failed:', error.message);
  }
}

seedRemote();
