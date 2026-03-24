import React from "react";
import products from "./data/products";

export default function ProductList() {
  const addToCart = (product) => {
    window.dispatchEvent(new CustomEvent("ADD_TO_CART", { detail: product }));
  };

  return (
    <div>
      <h2>Product List</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={p.image} width="100" />
            <h4>{p.name}</h4>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}