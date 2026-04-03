import React, { useState, useEffect } from "react";

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(45deg, #ef4444, #f97316)',
      borderRadius: '16px',
      padding: '25px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
      color: 'white',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '2.5rem' }}>⚡</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Flash Sale Madness</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Up to 50% OFF on selected tech gear. Don't miss out!</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.5px' }}>Ends in:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: '#7f1d1d', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '1.2rem', minWidth: '45px', textAlign: 'center' }}>{h}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center' }}>:</div>
          <div style={{ background: '#7f1d1d', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '1.2rem', minWidth: '45px', textAlign: 'center' }}>{m}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'center' }}>:</div>
          <div style={{ background: '#7f1d1d', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '1.2rem', minWidth: '45px', textAlign: 'center' }}>{s}</div>
        </div>
      </div>
    </div>
  );
}
