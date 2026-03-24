import React, { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Iphone", price: 1000 },
    { id: 2, name: "Laptop", price: 2000 },
  ]);

  const [editing, setEditing] = useState(null);

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
  };

  const updateProduct = (updated) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const startEdit = (product) => {
    setEditing(product);
  };

  return (
    <div>
      <h1>Admin App</h1>

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