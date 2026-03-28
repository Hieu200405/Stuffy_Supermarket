import React, { useState, useEffect } from "react";

const ProductForm = ({ onAdd, onUpdate, editing }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price);
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) return;

    const product = {
      id: editing ? editing.id : null,
      name,
      price: Number(price),
    };

    editing ? onUpdate(product) : onAdd(product);

    setName("");
    setPrice("");
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: '#f8fafc',
    marginBottom: '15px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div className="ds-glass-card" style={{ position: 'sticky', top: '120px' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '800' }}>
        {editing ? 'Sửa thông số Mã Hàng' : 'Nhập Hàng Mới Lên Kệ'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Tên Sản Phẩm</label>
        <input
          placeholder="VD: Chuột Gaming RGB"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />
        
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Giá Khuyến Mãi (USD)</label>
        <input
          placeholder="VD: 45"
          value={price}
          type="number"
          onChange={e => setPrice(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" className="ds-button" style={{ width: '100%', marginTop: '10px' }}>
          {editing ? "Lưu Cập Nhật Giá ⚡" : "Thêm Hàng Lên Kệ"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;