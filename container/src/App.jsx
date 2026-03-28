import React, { Suspense } from "react";
import "design_system/styles";

const Header = React.lazy(() => import("header/Header"));
const ProductList = React.lazy(() => import("product/ProductList"));
const Cart = React.lazy(() => import("cart/Cart"));
const Admin = React.lazy(() => import("admin/App"));

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading Header...</div>}>
         <Header />
      </Suspense>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', padding: '10px' }}>
        <div style={{ flex: 1, border: '1px solid #ddd', padding: '15px' }}>
          <Suspense fallback={<div>Loading Products...</div>}>
             <ProductList />
          </Suspense>
        </div>
        <div style={{ flex: 1, border: '1px solid #ddd', padding: '15px' }}>
          <Suspense fallback={<div>Loading Cart...</div>}>
             <Cart />
          </Suspense>
        </div>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '2px solid #ccc', padding: '20px' }}>
        <Suspense fallback={<div>Loading Admin...</div>}>
           <Admin />
        </Suspense>
      </div>
    </div>
  );
}