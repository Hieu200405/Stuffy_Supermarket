import React from "react";
import { useCartStore } from "store/store";
import Button from "design_system/Button";

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCartStore();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-1px' }}>Giỏ hàng của bạn.</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Đang có {cartItems.length} kiện hàng chờ thanh toán</p>
        </div>
        {cartItems.length > 0 && (
          <button onClick={clearCart} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', padding: '10px 20px', borderRadius: '99px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = '#fef2f2'} onMouseOut={e => e.target.style.background = 'transparent'}>
            Xóa Lịch Sử
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="ds-glass-card" style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', border: '2px dashed var(--border-light)' }}>
          <div style={{ fontSize: '5rem', opacity: 0.1, marginBottom: '20px' }}>🛒</div>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: '800' }}>Giỏ hàng siêu trống rỗng!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Hãy về lại Danh sách Cửa Hàng và bổ sung kho vũ khí ngay.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "start" }}>
          
          {/* Cột Trái: Danh sách Hàng */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 25px", background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                  <div style={{ width: '90px', height: '90px', background: '#f8fafc', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                    <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "1.3rem", fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</h4>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "500", fontSize: '0.9rem' }}>Mã Sản Phẩm: #{item.id.substring(0,8)}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                  <p style={{ margin: 0, color: "var(--text-main)", fontWeight: "800", fontSize: '1.4rem' }}>${item.price}</p>
                  
                  {/* Bộ phím Tăng Giảm Số Lượng UI cực Pro */}
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "#f1f5f9", padding: "6px", borderRadius: "99px", border: "1px solid var(--border-light)" }}>
                    <button onClick={() => decreaseQuantity(item.id)} style={{ background: "white", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "1.2rem", width: '32px', height: '32px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>−</button>
                    <span style={{ fontWeight: "800", width: "24px", textAlign: "center", color: "var(--text-main)" }}>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} style={{ background: "white", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "1.2rem", width: '32px', height: '32px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>+</button>
                  </div>
                  
                  {/* Nút Xóa Hàng Tinh Tế */}
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: '1.8rem', padding: '5px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#ef4444'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cột Phải: Bảng Tóm Tắt Checkout */}
          <div className="ds-glass-card" style={{ position: 'sticky', top: '120px', background: 'white' }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '1.4rem', fontWeight: '800' }}>Tóm Tắt Đơn Hàng</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '1.05rem' }}>Tạm tính ({cartItems.length} món)</span>
              <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>${total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '1.05rem' }}>Thuế VAT (0%)</span>
              <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>$0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '1.05rem' }}>Phí vận chuyển</span>
              <span style={{ fontWeight: '800', color: '#16a34a' }}>Miễn phí</span>
            </div>
            
            <div style={{ borderTop: '1px dashed var(--border-light)', margin: '20px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>Tổng Phải Thu</span>
              <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-1px' }}>${total}</span>
            </div>
            
            <Button style={{ width: "100%", fontSize: "1.2rem", padding: "18px", borderRadius: '16px' }}>
              Thanh Toán Ngay 🚀
            </Button>
            
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '20px', margin: '20px 0 0 0' }}>
              🔒 Thanh toán an toàn 100% bằng Apple Pay / Stripe.
            </p>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Cart;