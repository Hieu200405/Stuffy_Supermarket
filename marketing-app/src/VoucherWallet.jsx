import React, { useState } from "react";

export default function VoucherWallet() {
  const [vouchers, setVouchers] = useState([
    { id: 1, code: 'FREESHIP', type: 'shipping', value: 'Free Shipping', desc: 'Valid for orders over $50', expiry: '2 days' },
    { id: 2, code: 'TECH10', type: 'discount', value: '10% OFF', desc: 'Valid for Laptops and Phones', expiry: '12 hours' },
    { id: 3, code: 'WELCOME', type: 'discount', value: '$15 OFF', desc: 'For your first purchase', expiry: '5 days' }
  ]);

  const [claimed, setClaimed] = useState([]);

  const handleClaim = (id) => {
    if (!claimed.includes(id)) {
      setClaimed([...claimed, id]);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🎟️</span> My Voucher Wallet
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}>View All</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {vouchers.map(v => {
          const isClaimed = claimed.includes(v.id);
          return (
            <div key={v.id} style={{ display: 'flex', border: '1px solid', borderColor: isClaimed ? '#e2e8f0' : '#c7d2fe', borderRadius: '12px', overflow: 'hidden', opacity: isClaimed ? 0.6 : 1, transition: 'all 0.3s' }}>
              
              <div style={{ background: isClaimed ? '#f1f5f9' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: isClaimed ? '#94a3b8' : 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px 15px', minWidth: '90px', borderRight: '2px dashed', borderRightColor: isClaimed ? '#cbd5e1' : 'rgba(255,255,255,0.4)', position: 'relative' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 }}>{v.value.split(' ')[0]}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{v.value.split(' ').slice(1).join(' ')}</span>
                
                {/* Tick indentations for voucher tear effect */}
                <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '16px', height: '16px', borderRadius: '50%', background: 'white' }}></div>
                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '16px', height: '16px', borderRadius: '50%', background: 'white' }}></div>
              </div>

              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: isClaimed ? '#f8fafc' : 'white' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>{v.type}</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.2 }}>{v.desc}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>⏰ Exp: {v.expiry}</div>
                  <button 
                    onClick={() => handleClaim(v.id)}
                    disabled={isClaimed}
                    style={{ background: isClaimed ? 'transparent' : '#fef2f2', color: isClaimed ? '#94a3b8' : '#ef4444', border: isClaimed ? 'none' : '1px solid #fecaca', padding: '5px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: isClaimed ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}
                  >
                    {isClaimed ? 'Claimed ✓' : 'Claim Now'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
