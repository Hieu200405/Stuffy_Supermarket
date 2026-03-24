import React from "react";

const ProductList = ({ products, onDelete, onEdit }) => {
  return (
    <div>
      <h2>Product List</h2>

      {products.map(p => (
        <div key={p.id} style={{ borderBottom: "1px solid #ccc" }}>
          <p>{p.name} - ${p.price}</p>

          <button onClick={() => onEdit(p)}>Edit</button>
          <button onClick={() => onDelete(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;