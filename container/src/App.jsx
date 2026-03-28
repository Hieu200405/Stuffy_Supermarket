import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "design_system/styles";
import ErrorBoundary from "./components/ErrorBoundary";

const Header = React.lazy(() => import("header/Header"));
const ProductList = React.lazy(() => import("product/ProductList"));
const Cart = React.lazy(() => import("cart/Cart"));
const Admin = React.lazy(() => import("admin/App"));

const ProtectedModule = ({ children, moduleName }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
        <h3 style={{ fontWeight: '600' }}>Đang đồng bộ hạt nhân {moduleName}...</h3>
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0 0 0', borderBottom: '1px solid var(--border-light)', background: 'white' }}>
      <NavLink to="/" end style={({isActive}) => ({ textDecoration: 'none', fontWeight: isActive ? '800' : '600', color: isActive ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: isActive ? '3px solid var(--primary-color)' : '3px solid transparent', paddingBottom: '20px', marginBottom: '-1px', transition: 'all 0.2s' })}>
        🛍 Khám Phá
      </NavLink>
      <NavLink to="/cart" style={({isActive}) => ({ textDecoration: 'none', fontWeight: isActive ? '800' : '600', color: isActive ? 'var(--primary-color)' : 'var(--text-muted)', borderBottom: isActive ? '3px solid var(--primary-color)' : '3px solid transparent', paddingBottom: '20px', marginBottom: '-1px', transition: 'all 0.2s' })}>
        🛒 Giỏ Hàng & Thanh Toán
      </NavLink>
      <NavLink to="/admin" style={({isActive}) => ({ textDecoration: 'none', fontWeight: isActive ? '800' : '600', color: isActive ? '#ef4444' : 'var(--text-muted)', borderBottom: isActive ? '3px solid #ef4444' : '3px solid transparent', paddingBottom: '20px', marginBottom: '-1px', transition: 'all 0.2s' })}>
        ⚙️ Quản Trị Hệ Thống
      </NavLink>
    </nav>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ProtectedModule moduleName="Header"><Header /></ProtectedModule>
        <Navbar />
        
        <main style={{ padding: '50px 20px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={
              <>
                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '50px 60px', borderRadius: 'var(--radius-lg)', marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-hover)' }}>
                  <div>
                    <span className="ds-badge" style={{ background: 'var(--secondary-color)', color: 'white', marginBottom: '15px', display: 'inline-block' }}>Thế hệ mới 2.0</span>
                    <h2 style={{ fontSize: '3rem', margin: '0 0 15px 0', fontWeight: '800', lineHeight: 1.1 }}>Công nghệ Bán Lẻ <br/><span style={{ color: 'var(--accent-color)' }}>Tương Lai.</span></h2>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.5 }}>Trải nghiệm Hệ sinh thái Micro Frontend với tốc độ đồng bộ Dữ Liệu Thời Gian Thực chớp nhoáng.</p>
                  </div>
                  <div style={{ fontSize: '6rem', textShadow: '0 20px 30px rgba(0,0,0,0.5)' }}>🛍️</div>
                </div>
                <ProtectedModule moduleName="Quầy Hàng"><ProductList /></ProtectedModule>
              </>
            } />
            <Route path="/cart" element={<ProtectedModule moduleName="Thu Ngân"><Cart /></ProtectedModule>} />
            <Route path="/admin" element={<ProtectedModule moduleName="Admin"><Admin /></ProtectedModule>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}