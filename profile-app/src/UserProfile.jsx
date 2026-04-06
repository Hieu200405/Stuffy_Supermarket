import React, { useState, useEffect } from "react";
import Button from "design_system/Button";

export default function UserProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'settings'
  
  const userInfoString = localStorage.getItem('userInfo');
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  useEffect(() => {
    if (user && user.token) {
      fetch("https://stuffy-backend-api.onrender.com/api/orders/myorders", {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f8fafc', borderRadius: '16px' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Authentication Required</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please log in to view your profile and orders.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#10b981';
    if (status === 'Processing') return '#f59e0b';
    if (status === 'Cancelled') return '#ef4444';
    return '#6366f1';
  };

  return (
    <div style={{ display: 'flex', gap: '40px', minHeight: '600px' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid var(--border-light)', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 15px auto' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>{user.name}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</p>
          <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.75rem', fontWeight: 'bold', background: '#eef2ff', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '99px', textTransform: 'uppercase' }}>
            {user.role} Member
          </span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <button onClick={() => setActiveTab('orders')} style={{ width: '100%', textAlign: 'left', padding: '12px 20px', borderRadius: '12px', background: activeTab === 'orders' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'orders' ? 'white' : 'var(--text-main)', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📦 Order History
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('settings')} style={{ width: '100%', textAlign: 'left', padding: '12px 20px', borderRadius: '12px', background: activeTab === 'settings' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'settings' ? 'white' : 'var(--text-main)', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ⚙️ Account Settings
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 30px 0', fontWeight: '800', color: 'var(--text-main)' }}>My Orders</h2>
            
            {loading ? (
              <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '24px', border: '2px dashed var(--border-light)' }}>
                <span style={{ fontSize: '3rem', opacity: 0.5 }}>🛍️</span>
                <h3 style={{ margin: '15px 0 5px 0', color: 'var(--text-main)' }}>No pending orders</h3>
                <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't made a purchase yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {orders.map(order => (
                  <div key={order._id} style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Order ID</div>
                        <div style={{ fontWeight: 'mono', color: 'var(--text-main)', fontWeight: 'bold' }}>#{order._id?.substring(0, 8) || 'N/A'}</div>
                        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${getStatusColor(order.status || 'Processing')}15`, color: getStatusColor(order.status || 'Processing'), padding: '6px 12px', borderRadius: '99px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(order.status || 'Processing') }}></span>
                          {order.status || 'Processing'}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                          ${order.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f1f5f9', borderRadius: '10px', padding: '5px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                          </div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                      <Button style={{ flex: 1 }} onClick={() => alert('Feature coming soon: Track shipment')}>Track Package</Button>
                      <button style={{ padding: '0 20px', border: '1px solid var(--border-light)', background: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }} onMouseOver={e=>e.target.style.background='#f1f5f9'} onMouseOut={e=>e.target.style.background='white'}>
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 30px 0', fontWeight: '800', color: 'var(--text-main)' }}>Account Settings</h2>
            <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
               <h4 style={{ margin: '0 0 20px 0' }}>Profile Details</h4>
               <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your account information is handled securely.</p>
               
               <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                    <input type="text" value={user.name} disabled style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', boxSizing: 'border-box', color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
                    <input type="text" value={user.email} disabled style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', boxSizing: 'border-box', color: 'var(--text-muted)' }} />
                  </div>
               </div>
               
               <h4 style={{ margin: '40px 0 20px 0' }}>Address Book</h4>
               <div style={{ padding: '20px', border: '2px dashed var(--border-light)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                  + Add new shipping address
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
