import React, { useState } from "react";

export default function CheckoutModal({ total, onCheckout, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  
  const [payment, setPayment] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (shipping.address && shipping.city && shipping.postalCode && shipping.country) {
        setStep(2);
      } else {
        alert("Please fill all shipping fields.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payment.name || !payment.cardNumber || !payment.expiry || !payment.cvc) {
      alert("Please fill all payment fields.");
      return;
    }
    
    setLoading(true);
    // Fake stripe processing delay for wow effect
    setTimeout(async () => {
      await onCheckout(shipping);
      setLoading(false);
    }, 1500);
  };

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', marginBottom: '15px' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="ds-glass-card" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Secure Checkout</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Step {step} of 2 - {step === 1 ? 'Shipping Info' : 'Payment Details'}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* Total Badge */}
        <div style={{ background: '#f8fafc', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Order Total:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
        </div>

        {/* Content */}
        {step === 1 ? (
          <form onSubmit={handleNext}>
            <label style={labelStyle}>Street Address</label>
            <input type="text" placeholder="123 Main St" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} style={inputStyle} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" placeholder="New York" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input type="text" placeholder="10001" value={shipping.postalCode} onChange={(e) => setShipping({...shipping, postalCode: e.target.value})} style={inputStyle} required />
              </div>
            </div>

            <label style={labelStyle}>Country</label>
            <input type="text" placeholder="United States" value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} style={inputStyle} required />

            <button type="submit" className="ds-button" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
              Continue to Payment
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', color: '#b91c1c', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>💳</span>
              <span><strong>Test Mode</strong> - Feel free to use dummy text for the card details. No actual charges will be made.</span>
            </div>

            <label style={labelStyle}>Name on Card</label>
            <input type="text" placeholder="John Doe" value={payment.name} onChange={(e) => setPayment({...payment, name: e.target.value})} style={inputStyle} required />

            <label style={labelStyle}>Card Number</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} value={payment.cardNumber} onChange={(e) => setPayment({...payment, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()})} style={{...inputStyle, paddingLeft: '40px', fontFamily: 'monospace', fontSize: '1.1rem'}} required />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ position: 'absolute', top: '15px', left: '12px', height: '12px', opacity: 0.5 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Expiry (MM/YY)</label>
                <input type="text" placeholder="12/26" maxLength={5} value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>CVC</label>
                <input type="text" placeholder="123" maxLength={4} value={payment.cvc} onChange={(e) => setPayment({...payment, cvc: e.target.value})} style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '14px 20px', background: '#f1f5f9', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                Back
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '14px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing via Stripe...' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
