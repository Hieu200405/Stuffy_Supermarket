import React from "react";
import { createRoot } from "react-dom/client";
import FlashSaleBanner from "./FlashSaleBanner";
import VoucherWallet from "./VoucherWallet";

const root = createRoot(document.getElementById("root"));
root.render(
  <div style={{ padding: '20px' }}>
    <FlashSaleBanner />
    <VoucherWallet />
  </div>
);
