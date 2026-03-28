import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // KÉO DATA SỐNG TỪ BACKEND
  const fetchProducts = () => {
    fetch("https://stuffy-backend-api.onrender.com/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    fetch("https://stuffy-backend-api.onrender.com/api/products", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: product.name, price: Number(product.price) })
    })
    .then(res => res.json())
    .then(newP => setProducts([...products, newP]));
  };

  const updateProduct = (updated) => {
    fetch(`https://stuffy-backend-api.onrender.com/api/products/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: updated.name, price: Number(updated.price) })
    })
    .then(res => res.json())
    .then(updatedP => {
      setProducts(products.map(p => p.id === updatedP.id ? updatedP : p));
      setEditing(null);
    });
  };

  const deleteProduct = (id) => {
    fetch(`https://stuffy-backend-api.onrender.com/api/products/${id}`, { method: 'DELETE' })
    .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  const startEdit = (product) => {
    setEditing(product);
  };

  return (
    <div>
      <h1 style={{ color: "#6366f1", marginBottom: "20px" }}>Kho Điều Khiển Trung Tâm (Trực Tuyến Database)</h1>

      <ProductForm
        onAdd={addProduct}
        onUpdate={updateProduct}
        editing={editing}
      />

      <ProductList
        products={products}
        onDelete={deleteProduct}
        onEdit={startEdit}
      />
    </div>
  );
};

export default App;