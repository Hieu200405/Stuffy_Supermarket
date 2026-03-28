import React from 'react';
import '../index.css';

export default function GlassCard({ children, style }) {
  return (
    <div className="ds-glass-card" style={style}>
      {children}
    </div>
  );
}
