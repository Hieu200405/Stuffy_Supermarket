import React, { useState, useEffect, Suspense } from "react";
import { useCartStore } from "store/store";
import Button from "design_system/Button";
import { io } from "socket.io-client";

// Móc nối Component 3D Năng Ký (2MB+) bằng Lazy Load, chỉ tải khi khách bấm "Xem 3D"
const Viewer3D = React.lazy(() => import("viewer/Viewer"));

const socket = io("https://stuffy-backend-api.onrender.com");

export default function ProductList() {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashingId, setFlashingId] = useState(null);
  const [active3DColor, setActive3DColor] = useState(null); // Quản lý Bật tắt AR

  useEffect(() => {
    fetch("https://stuffy-backend-api.onrender.com/api/products")
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error("Lỗi:", err); setLoading(false); });

    socket.on("PRICE_UPDATED", (updatedProduct) => {
      setProducts((current) => current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setFlashingId(updatedProduct.id);
      setTimeout(() => setFlashingId(null), 1500);
    });

    socket.on("NEW_PRODUCT", (newProduct) => setProducts((current) => [...current, newProduct]));
    socket.on("PRODUCT_DELETED", (id) => setProducts((current) => current.filter(p => p.id !== id)));

    return () => {
      socket.off("PRICE_UPDATED");
      socket.off("NEW_PRODUCT");
      socket.off("PRODUCT_DELETED");
    };
  }, []);

  if (loading) return <div style={{ color: "var(--text-muted)", fontSize: '1.2rem', textAlign: 'center', padding: '40px' }}>🔄 Đang kết nối tổng đài hàng hóa...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
         <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Sản Phẩm Trực Tuyến</h3>
         <span className="ds-badge" style={{ background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}>
            <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', animation: 'blink 1s infinite alternate' }}></span>
            Live Sync: Đang bật
         </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {products.map((p) => {
          const isFlashing = flashingId === p.id;
          return (
            <div key={p.id} className="ds-glass-card" style={{ 
              display: "flex", flexDirection: "column",
              transform: isFlashing ? "scale(1.05)" : "scale(1)",
              border: isFlashing ? "2px solid #ef4444" : "",
              boxShadow: isFlashing ? "0 20px 25px -5px rgba(239, 68, 68, 0.2)" : ""
            }}>
              {/* Product Image Frame */}
              <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'center', transition: 'all 0.3s' }}>
                <img src={p.image} alt={p.name} style={{ width: "160px", height: "160px", objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </div>
              
              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.3rem", fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</h4>
              <p style={{ margin: "0 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>Mã SP: #{p.id.substring(0, 6)}</p>
              
              <button 
                onClick={() => {
                  // Giả lập màu dựa trên ID sơ sơ để vật thẻ xoay khác nhau mỗi món
                  const colorMatch = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][p.id.charCodeAt(p.id.length-1) % 5];
                  setActive3DColor(colorMatch);
                }} 
                style={{ marginTop: '15px', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', background: '#f8fafc', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', color: 'var(--text-main)' }}
                onMouseOver={e => { e.target.style.background = 'var(--primary-color)'; e.target.style.color = 'white'; }}
                onMouseOut={e => { e.target.style.background = '#f8fafc'; e.target.style.color = 'var(--text-main)'; }}
              >
                🕶️ Trải Nghiệm 3D AR
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {isFlashing && <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '800', marginBottom: '5px' }}>🔥 VỪA GIẢM GIÁ GẤP</span>}
                  <span style={{ margin: 0, fontWeight: "800", fontSize: isFlashing ? "1.8rem" : "1.5rem", color: isFlashing ? "#ef4444" : "var(--primary-color)", transition: "all 0.3s" }}>
                    ${p.price}
                  </span>
                </div>
                <Button onClick={() => addToCart(p)} style={{ background: isFlashing ? "#ef4444" : "var(--primary-color)" }}>
                  {isFlashing ? "Cướp Ngay" : "Thêm"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 🔮 CỔNG DỊCH CHUYỂN 3D AR MFE (Dịch chuyển Component 3MB từ Cổng 3007 tàng hình vào đây) */}
      {active3DColor && (
        <Suspense fallback={
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.5rem', animation: 'blink 1s infinite alternate' }}>⏳ Đang tải Động cơ 3D Engine (Three.js) & Dữ liệu Khối từ MFE 3007...</span>
          </div>
        }>
          <Viewer3D color={active3DColor} onClose={() => setActive3DColor(null)} />
        </Suspense>
      )}

      <style>{`
        @keyframes blink { 0% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}