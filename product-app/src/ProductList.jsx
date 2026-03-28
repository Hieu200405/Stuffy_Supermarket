import React from "react";
import products from "./data/products";
import { useCartStore } from "store/store";
import Button from "design_system/Button";
import GlassCard from "design_system/GlassCard";

export default function ProductList() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Sản phẩm mới nhất</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
        {products.map((p) => (
          <GlassCard key={p.id} style={{ width: "250px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }} />
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", textAlign: "center" }}>{p.name}</h4>
            <p style={{ margin: "0 0 15px 0", color: "#a855f7", fontWeight: "bold", fontSize: "1.2rem" }}>${p.price}</p>
            <Button onClick={() => addToCart(p)} style={{ width: "100%" }}>
              🛒 Khóa Đơn
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}