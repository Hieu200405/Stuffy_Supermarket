const vipProducts = [
  { name: "MacBook Pro M3 Max", price: 3499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
  { name: "Kính Apple Vision Pro Cao Cấp", price: 3499, image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
  { name: "Tai nghe Sony WH-1000XM5", price: 398, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
  { name: "Máy chơi game PlayStation 5", price: 499, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80" },
  { name: "Bàn phím cơ Keychron Q1 Pro", price: 199, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { name: "Chuột đồ họa Logitech MX Master 3S", price: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
  { name: "Cam hành trình GoPro Hero 12", price: 399, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80" },
  { name: "Loa Bluetooth Marshall Stanmore III", price: 379, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80" }
];

async function seedRemote() {
  const baseURL = 'https://stuffy-backend-api.onrender.com/api/products';
  
  try {
    console.log("✈️ Đang điều động phi cơ kết nối vào Backend (Render)...");
    const res = await fetch(baseURL);
    const currentProducts = await res.json();
    
    console.log(`🧹 Đã quét thấy ${currentProducts.length} mặt hàng giả lưu trong kho. Tiến hành vứt rác...`);
    for (const p of currentProducts) {
      if (p.id) {
         await fetch(`${baseURL}/${p.id}`, { method: 'DELETE' });
         console.log(`Đã xóa phế phẩm: ${p.id}`);
      }
    }
    
    console.log("💎 Máy chủ bay đã bay vào quỹ đạo. Bắt đầu Dội Bom Máy Ảnh & Máy Tính Xuống Siêu Thị!");
    for (const newP of vipProducts) {
      await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newP)
      });
      console.log(`📦 Bơm hàng thành công: ${newP.name}`);
    }
    
    console.log("✅ HOÀN TẤT CHIẾN DỊCH TÂN TRANG HÀNG HÓA! BẠN CÓ THỂ MỞ APP NGAY LẬP TỨC.");
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

seedRemote();
