import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "design_system/styles";
import ErrorBoundary from "./components/ErrorBoundary";

// Gỡ tải lười biếng MFE (Treo cho tới khi MFE con phản hồi)
const Header = React.lazy(() => import("header/Header"));
const ProductList = React.lazy(() => import("product/ProductList"));
const Cart = React.lazy(() => import("cart/Cart"));
const Admin = React.lazy(() => import("admin/App"));

// Lõi Áo Giáp = Tấm Khiên ErrorBoundary bọc Lớp Kính Chống Đạn Suspense Loading
const ProtectedModule = ({ children, moduleName }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div style={{ padding: '30px', color: '#a855f7', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
        <span style={{ animation: 'blink 1s infinite alternate', display: 'inline-block' }}>⚡ Đang giải nén không gian {moduleName}...</span>
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Component Navbar Động (Bôi sáng menu đang chọn)
const Navbar = () => {
  const location = useLocation();
  const getStyle = (path) => ({
    color: 'white', textDecoration: 'none', fontWeight: 'bold', padding: '10px 20px', borderRadius: '12px',
    background: location.pathname === path ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
    border: location.pathname === path ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
    transition: 'all 0.3s'
  });

  return (
    <div style={{ display: 'flex', gap: '15px', padding: '15px 30px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
      <Link to="/" style={getStyle('/')}>🛍 Tủ Kính Sản Phẩm</Link>
      <Link to="/cart" style={getStyle('/cart')}>🛒 Máy Quẹt Thẻ (Giỏ Hàng)</Link>
      <Link to="/admin" style={{ ...getStyle('/admin'), marginLeft: 'auto', color: '#ef4444', borderColor: location.pathname === '/admin' ? '#ef4444' : 'transparent' }}>⚙️ Hầm Quản Trị Hệ Thống</Link>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Background toàn trang dùng CSS Tokens của Design System */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <ProtectedModule moduleName="Bảng Hiệu Thượng Tầng (Header)">
          <Header />
        </ProtectedModule>
        
        {/* THANH ĐIỀU HƯỚNG SPA MƯỢT MÀ KHÔNG LOAD TRANG */}
        <Navbar />

        {/* CÁC CĂN PHÒNG ĐƯỢC CHIA TÁCH BẰNG ROUTER */}
        <div style={{ padding: '30px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={
              <ProtectedModule moduleName="Kho Sản Phẩm Real-time">
                <ProductList />
              </ProtectedModule>
            } />
            
            <Route path="/cart" element={
              <ProtectedModule moduleName="Bot Thu Ngân">
                <Cart />
              </ProtectedModule>
            } />
            
            <Route path="/admin" element={
              <ProtectedModule moduleName="Trung Tâm Dữ Liệu Admin">
                <Admin />
              </ProtectedModule>
            } />
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}