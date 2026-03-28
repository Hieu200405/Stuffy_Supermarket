import React from "react";
import { useCartStore } from "store/store";
import Button from "design_system/Button";
import GlassCard from "design_system/GlassCard";

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Giỏ hàng ({cartItems.length})</h2>
        {cartItems.length > 0 && (
          <Button onClick={clearCart} style={{ background: "rgba(239, 68, 68, 0.4)", color: "white", padding: "8px 16px" }}>
            Xóa Lịch Sử
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <GlassCard>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "1.1rem" }}>Giỏ hàng bạn hiện đang trống rỗng 🍃</p>
        </GlassCard>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {cartItems.map((item) => (
            <GlassCard key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px" }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>{item.name}</h4>
                <p style={{ margin: 0, color: "#a855f7", fontWeight: "600" }}>${item.price} / item</p>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", padding: "5px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <button onClick={() => decreaseQuantity(item.id)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem", padding: "0 10px" }}>-</button>
                  <span style={{ fontWeight: "bold", width: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem", padding: "0 10px" }}>+</button>
                </div>
                <Button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.5)", color: "#ef4444", padding: "8px 15px", boxShadow: "none" }}>
                  Bỏ
                </Button>
              </div>
            </GlassCard>
          ))}

          <GlassCard style={{ marginTop: "10px", border: "1px solid rgba(168, 85, 247, 0.5)", background: "rgba(168, 85, 247, 0.15)" }}>
            <h3 style={{ margin: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: "#fff", fontSize: "1.8rem" }}>${total}</span>
            </h3>
            <Button style={{ width: "100%", marginTop: "20px", fontSize: "1.2rem", padding: "15px" }}>
              💳 Quẹt Thẻ Tính Tiền 🚀
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Cart;