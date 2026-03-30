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
  const [active3DColor, setActive3DColor] = useState(null);
  const [aiMatches, setAiMatches] = useState(null); // null = không lọc, [] = không khớp, [...] = có khớp

  useEffect(() => {
    fetch("https://stuffy-backend-api.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        // Bảo vệ: nếu backend trả về { error: "..." } thay vì [] thì không crash
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API trả về dữ liệu không hợp lệ (MongoDB chưa kết nối?):", data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => { console.error("Lỗi fetch:", err); setLoading(false); });

    socket.on("PRICE_UPDATED", (updatedProduct) => {
      setProducts((current) => current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setFlashingId(updatedProduct.id);
      setTimeout(() => setFlashingId(null), 1500);
    });

    socket.on("NEW_PRODUCT", (newProduct) => setProducts((current) => [...current, newProduct]));
    socket.on("PRODUCT_DELETED", (id) => setProducts((current) => current.filter(p => p.id !== id)));

    // Lắng nghe kết quả AI từ Header App (cross-MFE qua CustomEvent)
    const handleAIResult = (e) => {
      setAiMatches(e.detail.matches); // null = xóa filter
    };
    window.addEventListener('AI_SEARCH_RESULT', handleAIResult);
    
    return () => {
      socket.off("PRICE_UPDATED");
      socket.off("NEW_PRODUCT");
      socket.off("PRODUCT_DELETED");
      window.removeEventListener('AI_SEARCH_RESULT', handleAIResult);
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

      {/* Banner kết quả AI */}
      {aiMatches !== null && (
        <div style={{ marginBottom: '24px', padding: '14px 20px', background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', borderRadius: '14px', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>✨</span>
            <div>
              <p style={{ margin: 0, fontWeight: '800', color: '#4338ca', fontSize: '0.95rem' }}>AI tìm thấy {aiMatches.length} sản phẩm phù hợp</p>
              <p style={{ margin: 0, color: '#6366f1', fontSize: '0.82rem' }}>Các sản phẩm khọc nhạt được lọc ra</p>
            </div>
          </div>
          <button onClick={() => { setAiMatches(null); window.dispatchEvent(new CustomEvent('AI_SEARCH_RESET')); }} style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: '700', color: '#6366f1', background: 'white', border: '1px solid #c7d2fe', borderRadius: '99px', cursor: 'pointer' }}>
            × Xóa lọc
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {products.map((p) => {
          const isFlashing = flashingId === p.id;
          // AI highlight: đứng vờ không biết khi nào match
          const isAiMatch = aiMatches !== null && aiMatches.some(name => 
            p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase())
          );
          const isDimmed = aiMatches !== null && !isAiMatch;
          return (
            <div key={p.id} className="ds-glass-card" style={{ 
              display: "flex", flexDirection: "column",
              transform: isFlashing ? "scale(1.05)" : isAiMatch ? "scale(1.03)" : "scale(1)",
              border: isFlashing ? "2px solid #ef4444" : isAiMatch ? "2px solid #6366f1" : "",
              boxShadow: isFlashing ? "0 20px 25px -5px rgba(239, 68, 68, 0.2)" : isAiMatch ? "0 20px 40px rgba(99,102,241,0.2)" : "",
              opacity: isDimmed ? 0.35 : 1,
              transition: 'all 0.4s',
              position: 'relative',
            }}>
              {/* Badge AI gợi ý */}
              {isAiMatch && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '99px', letterSpacing: '0.3px' }}>
                  ✨ AI Gợi ý
                </div>
              )}
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