import React, { useState, useEffect } from "react";
import { useCartStore } from "store/store";
import Button from "design_system/Button";
import GlassCard from "design_system/GlassCard";
import { io } from "socket.io-client";

// Khớp nối kết nối ăng-ten liên tục với Trạm phát thanh Backend
const socket = io("http://localhost:5000");

export default function ProductList() {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashingId, setFlashingId] = useState(null); // Lưu trữ ID của hàng hoá bị Sờ Gáy

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy API: ", err);
        setLoading(false);
      });

    // ⚡ SỰ KIỆN VIỄN TƯỞNG: LẮNG NGHE QUẢN TRỊ VIÊN THAY ĐỔI GIÁ TỪ ADMIN APP
    socket.on("PRICE_UPDATED", (updatedProduct) => {
      // 1. Áp giá mới vào dữ liệu
      setProducts((currentProducts) =>
        currentProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      
      // 2. Kích nổ bom Hiệu ứng Thị Giác (Phóng to đỏ chót)
      setFlashingId(updatedProduct.id);
      
      // Khôi phục thẻ card về trạng thái cũ sau 1.5 giây nhấp nháy
      setTimeout(() => {
        setFlashingId(null);
      }, 1500);
    });

    // Món hàng mới đột nhiên rớt xuống kệ Web ngay khi Admin bấm phím
    socket.on("NEW_PRODUCT", (newProduct) => {
      setProducts((current) => [...current, newProduct]);
    });

    socket.on("PRODUCT_DELETED", (id) => {
      setProducts((current) => current.filter(p => p.id !== id));
    });

    return () => {
      socket.off("PRICE_UPDATED");
      socket.off("NEW_PRODUCT");
      socket.off("PRODUCT_DELETED");
    };
  }, []);

  if (loading) return <div style={{ color: "#a855f7", fontSize: '1.2rem', padding: '20px' }}>⚡ Đang dải mạng chờ Container tải MFE...</div>;

  return (
    <div>
      <style>{`
        @keyframes pulseAlert {
          0% { opacity: 1; transform: scale(1.05); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Quầy Hàng Real-time 📈</h2>
         
         {/* Phù hiệu báo cáo Đang Cắm Cáp Live Sync như Youtube/Facebook */}
         <span style={{ background: '#0f172a', color: '#f8fafc', padding: '6px 15px', borderRadius: '30px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e', animation: 'blink 1s infinite alternate' }}></span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Trực tuyến Live Stream Server</span>
         </span>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
        {products.map((p) => {
          const isFlashing = flashingId === p.id;
          return (
            <GlassCard key={p.id} style={{ 
              width: "250px", display: "flex", flexDirection: "column", alignItems: "center",
              transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              // THUẬT TOÁN KÍCH NHIỆT (Đổ bóng 3D, phóng to)
              transform: isFlashing ? "scale(1.08) translateY(-10px)" : "scale(1)",
              border: isFlashing ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: isFlashing ? "0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.3)" : ""
            }}>
              <img src={p.image} alt={p.name} style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }} />
              <h4 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", textAlign: "center" }}>{p.name}</h4>
              
              <p style={{ 
                margin: "0 0 15px 0", fontWeight: "bold", 
                fontSize: isFlashing ? "2.2rem" : "1.2rem",
                color: isFlashing ? "#ef4444" : "#a855f7",
                textShadow: isFlashing ? "0 0 15px rgba(239, 68, 68, 0.9)" : "none",
                transition: "all 0.3s ease"
              }}>
                ${p.price}
                {isFlashing && (
                  <span style={{ fontSize: '0.9rem', display: 'block', color: '#ef4444', animation: 'pulseAlert 0.4s infinite', marginTop: '5px' }}>
                    🔥 RẺ SỐC THÊM ƯU ĐÃI 🔥
                  </span>
                )}
              </p>
              
              <Button onClick={() => addToCart(p)} style={{ width: "100%", background: isFlashing ? "linear-gradient(135deg, #ef4444, #dc2626)" : "" }}>
                {isFlashing ? "Cướp Ngay!" : "🛒 Khóa Đơn"}
              </Button>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}