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

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <button type="submit">
        {editing ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default ProductForm;