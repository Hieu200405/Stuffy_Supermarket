import React from 'react';
import AISearchBar from './AISearchBar';
import NotificationBell from './NotificationBell';
import SimpleSearchBar from './SimpleSearchBar';
import LanguageSwitcher from './LanguageSwitcher';
// @ts-ignore
import { cartCount } from 'store/signals';

export default function Header() {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '12px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '45px', height: '45px', background: 'var(--primary-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.4rem' }}>
            S
          </div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
            Stuffy<span style={{ color: 'var(--secondary-color)' }}>Store</span>
          </h1>
        </div>

        {/* 🔍 Thanh Tìm Kiếm Standard (Real-time) */}
        <SimpleSearchBar />
      </div>

      {/* 🤖 Thanh Tìm Kiếm AI thay thế ô search tĩnh */}
      <AISearchBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontWeight: '600', color: 'var(--text-muted)', cursor: 'pointer' }}>Support</span>
        
        {/* Notification Bell Component */}
        <NotificationBell />
        
        {/* Sync i18n Switcher */}
        <LanguageSwitcher />

        {/* 🛒 Elite Cross-MFE Cart Badge (Signals) */}
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '45px', height: '45px', background: '#f8fafc', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', color: 'var(--text-main)' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          {cartCount.value > 0 && (
            <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary-color)', color: 'white', fontSize: '0.75rem', fontWeight: '900', padding: '1px 7px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(99, 102, 241, 0.4)' }}>
              {cartCount.value}
            </div>
          )}
        </div>
        
        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#ea580c', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginLeft: '10px' }}>NV</div>
      </div>
    </header>
  );
}