import React from "react";

const ProductList = ({ products, onDelete, onEdit }) => {
  return (
    <div className="ds-glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {/* Table Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px 150px', gap: '15px', padding: '15px 20px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)', fontWeight: '700', color: 'var(--text-muted)' }}>
        <div>Product</div>
        <div>Price</div>
        <div style={{ textAlign: 'right' }}>Actions</div>
      </div>

      {/* Table Body */}
      <div>
        {products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.93rem' }}>No products found. Add one to get started.</div>
        ) : (
          products.map(p => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px 150px', gap: '15px', padding: '15px 20px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontWeight: '600' }}>{p.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description || "No description"}</div>
              </div>
              
              <div style={{ fontWeight: '800', color: 'var(--primary-color)' }}>
                ${p.price}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => onEdit(p)} 
                  style={{ background: '#f1f5f9', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                  onMouseOver={e => e.target.style.background = '#e2e8f0'}
                  onMouseOut={e => e.target.style.background = '#f1f5f9'}
                >
                   Edit
                </button>
                <button 
                  onClick={() => onDelete(p.id)} 
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                  onMouseOver={e => e.target.style.background = '#fee2e2'}
                  onMouseOut={e => e.target.style.background = '#fef2f2'}
                >
                  Delete
                </button>
              </div>
              
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default ProductList;