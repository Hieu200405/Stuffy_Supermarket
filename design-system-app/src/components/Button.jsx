import React from 'react';
import '../index.css';

export default function Button({ children, onClick, style }) {
  return (
    <button className="ds-button" onClick={onClick} style={style}>
      {children}
    </button>
  );
}
