import React from 'react';
import AISearchBar from './AISearchBar';

export default function Header() {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '45px', height: '45px', background: 'var(--primary-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.4rem' }}>
          S
        </div>
        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
          Stuffy<span style={{ color: 'var(--secondary-color)' }}>Store</span>
        </h1>
      </div>

      {/* 🤖 Thanh Tìm Kiếm AI thay thế ô search tĩnh */}
      <AISearchBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <span style={{ fontWeight: '600', color: 'var(--text-muted)', cursor: 'pointer' }}>Support</span>
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#ea580c', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>NV</div>
      </div>
    </header>
  );
}