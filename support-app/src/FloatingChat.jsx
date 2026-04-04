import React, { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi there! I am the Stuffy AI Support. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // 1. Get Context (Orders metadata if user is logged in)
      const userInfoString = localStorage.getItem('userInfo');
      let orderContext = "User is not logged in.";
      if (userInfoString) {
        const user = JSON.parse(userInfoString);
        try {
          const res = await fetch("https://stuffy-backend-api.onrender.com/api/orders/myorders", {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          if (res.ok) {
            const orders = await res.json();
            orderContext = `Customer Name: ${user.name}. \nRecent Orders: \n` + 
              orders.map(o => `- Order ID: ${o._id}, Status: ${o.status || 'Processing'}, Total: $${o.totalPrice}, Items: ${o.orderItems.map(i => i.name).join(', ')}`).join('\n');
          }
        } catch (err) { orderContext = "Failed to fetch orders context."; }
      }

      // 2. Call Gemini
      const prompt = `You are a professional and friendly Customer Service Agent for Stuffy Store. 
      Context about the current user:
      ${orderContext}

      Instructions:
      - Answer based on the user's request.
      - If they ask about orders, look at the Context provided.
      - If they ask about products, explain that you are a general support bot and they can use the AI Search in header for catalog.
      - Be concise and helpful.
      - User Query: "${userMessage}"`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 800 }
        })
      });

      if (!response.ok) throw new Error("Gemini Service Unavailable");
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble thinking right now. Please try again.";

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '1.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(99,102,241,0.4)', transition: 'transform 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'}
          onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{ width: '380px', height: '550px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          {/* Header */}
          <div style={{ background: 'var(--primary-color)', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem' }}>⚡</div>
                <div>
                   <div style={{ fontWeight: 'bold' }}>Stuffy Support</div>
                   <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online · AI Agent</div>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', opacity: 0.8 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc' }}>
             {messages.map((m, i) => (
                <div key={i} style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', 
                  maxWidth: '85%', 
                  padding: '12px 16px', 
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                  background: m.role === 'user' ? 'var(--primary-color)' : 'white', 
                  color: m.role === 'user' ? 'white' : 'var(--text-main)', 
                  boxShadow: m.role === 'user' ? '0 4px 10px rgba(99,102,241,0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '0.92rem',
                  lineHeight: '1.5'
                }}>
                   {m.text}
                </div>
             ))}
             {loading && (
               <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px 15px', borderRadius: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                  Stuffy is thinking...
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px', background: 'white' }}>
             <input 
               type="text" 
               placeholder="Write a message..." 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               disabled={loading}
               style={{ flex: 1, padding: '12px 16px', borderRadius: '99px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.9rem' }} 
             />
             <button type="submit" disabled={loading} style={{ width: '45px', height: '45px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: loading ? 0.6 : 1 }}>
                🚀
             </button>
          </form>
        </div>
      )}
    </div>
  );
}
