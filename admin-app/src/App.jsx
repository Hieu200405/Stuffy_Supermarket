import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // KÉO DATA SỐNG TỪ BACKEND
  const fetchProducts = () => {
    fetch("https://stuffy-backend-api.onrender.com/api/products?pageNumber=1")
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getToken = () => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) return '';
    try { return JSON.parse(userInfoString).token; } catch (e) { return ''; }
  };

  const addProduct = (product) => {
    fetch("https://stuffy-backend-api.onrender.com/api/products", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ name: product.name, price: Number(product.price), description: product.description, category: product.category })
    })
    .then(res => res.json())
    .then(newP => setProducts([...products, newP]));
  };

  const updateProduct = (updated) => {
    fetch(`https://stuffy-backend-api.onrender.com/api/products/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ name: updated.name, price: Number(updated.price), description: updated.description, category: updated.category })
    })
    .then(res => res.json())
    .then(updatedP => {
      setProducts(products.map(p => p.id === updatedP.id ? updatedP : p));
      setEditing(null);
    });
  };

  const deleteProduct = (id) => {
    fetch(`https://stuffy-backend-api.onrender.com/api/products/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  const startEdit = (product) => {
    setEditing(product);
  };

  return (
    <div>
      <div style={{ marginBottom: "30px", borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <h1 style={{ color: "var(--text-main)", margin: "0 0 6px 0", fontSize: '2.2rem', fontWeight: '800' }}>Admin BI Dashboard</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>Analyze business trends, user behavioral funnels and real-time inventory performance.</p>
      </div>

      <Dashboard products={products} />

      <div style={{ marginBottom: '30px' }}>
         <h2 style={{ color: "var(--text-main)", fontSize: '1.5rem', fontWeight: '800' }}>Product Inventory</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '30px', alignItems: 'start' }}>
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
    </div>
  );
};

export default App;