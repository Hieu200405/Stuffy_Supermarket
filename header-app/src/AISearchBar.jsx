import React, { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Ví dụ sản phẩm để AI có ngữ cảnh phân tích
const PRODUCT_CONTEXT = `
Hệ thống Stuffy Supermarket có các sản phẩm công nghệ sau:
1. MacBook Pro M3 Max - laptop cao cấp, làm việc, lập trình, đồ họa
2. Apple Vision Pro - kính thực tế hỗn hợp, AR/VR, 3D, xem phim
3. Sony WH-1000XM5 - tai nghe chống ồn, nhạc, podcast, làm việc
4. PlayStation 5 - máy chơi game, giải trí, gaming
5. Keychron Q1 Pro - bàn phím cơ, lập trình, văn phòng
6. Logitech MX Master 3S - chuột đồ họa, thiết kế, văn phòng
7. GoPro Hero 12 - camera hành trình, du lịch, outdoor, quay vlog
8. Marshall Stanmore III - loa bluetooth, âm nhạc, phòng khách
`;

async function callGemini(userQuery, products) {
  const productList = products.map(p => `- ${p.name} ($${p.price})`).join('\n');
  
  const prompt = `Bạn là trợ lý AI cho siêu thị công nghệ Stuffy Supermarket.
Dựa vào yêu cầu của khách hàng: "${userQuery}"

Danh sách sản phẩm trong cửa hàng:
${productList}

Hãy:
1. Phân tích nhu cầu của khách hàng bằng ngôn ngữ tự nhiên (2-3 câu ngắn gọn, thân thiện).
2. Trả về mảng JSON tên các sản phẩm phù hợp nhất (dựa ĐÚNG tên trong danh sách sản phẩm, tối đa 4 sản phẩm).

Trả lời theo định dạng JSON sau, KHÔNG viết gì thêm ngoài JSON:
{
  "message": "Lời nhận xét / giải thích của AI (ngắn gọn, tiếng Việt, thân thiện)",
  "matches": ["Tên sản phẩm 1", "Tên sản phẩm 2"]
}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
    })
  });

  if (!response.ok) throw new Error(`API lỗi: ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Trích xuất JSON từ response (đôi khi Gemini wrap trong ```json ```)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini không trả về JSON hợp lệ');
  return JSON.parse(jsonMatch[0]);
}

export default function AISearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // { message, matches }
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Lắng nghe sự kiện reset khi người dùng bấm X
  useEffect(() => {
    const handleReset = () => { setQuery(''); setAiResult(null); };
    window.addEventListener('AI_SEARCH_RESET', handleReset);
    return () => window.removeEventListener('AI_SEARCH_RESET', handleReset);
  }, []);

  const handleSearch = async (e) => {
    if (e.key !== 'Enter' || !query.trim()) return;
    
    setLoading(true);
    setAiResult(null);

    try {
      // Lấy danh sách sản phẩm từ Backend
      const products = await fetch('https://stuffy-backend-api.onrender.com/api/products')
        .then(r => r.json()).catch(() => []);

      const result = await callGemini(query, products);

      setAiResult(result);
      
      // Phát sự kiện cross-MFE để product-app lọc UI
      window.dispatchEvent(new CustomEvent('AI_SEARCH_RESULT', { 
        detail: { matches: result.matches, query }
      }));
    } catch (err) {
      setAiResult({ message: `⚠️ Lỗi kết nối AI: ${err.message}. Hãy kiểm tra GEMINI_API_KEY.`, matches: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setAiResult(null);
    window.dispatchEvent(new CustomEvent('AI_SEARCH_RESULT', { detail: { matches: null } }));
    inputRef.current?.focus();
  };

  return (
    <div style={{ width: '480px', position: 'relative' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ai-search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 4px 20px rgba(99,102,241,0.1);
        }
      `}</style>

      {/* Ô Input */}
      <div className="ai-search-glow" style={{
        position: 'relative',
        borderRadius: '99px',
        background: focused ? 'white' : '#f1f5f9',
        border: `1.5px solid ${focused ? '#a5b4fc' : 'var(--border-light)'}`,
        transition: 'all 0.25s',
      }}>
        {/* Icon AI / Loading */}
        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.15rem', pointerEvents: 'none' }}>
          {loading ? (
            <span style={{
              display: 'inline-block',
              width: '18px', height: '18px',
              border: '2px solid #e0e7ff',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : aiResult ? '✨' : '🔍'}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={loading ? 'AI đang phân tích...' : 'Hỏi AI: "Thiết lập bàn làm việc ngầu"...'}
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 45px 13px 48px',
            borderRadius: '99px',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.97rem',
            color: 'var(--text-main)',
            boxSizing: 'border-box',
          }}
        />

        {/* Nút X hoặc nhãn AI */}
        {query ? (
          <button onClick={handleClear} style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            background: '#e2e8f0', border: 'none', borderRadius: '50%',
            width: '22px', height: '22px', cursor: 'pointer',
            fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        ) : (
          <span style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.5px',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            pointerEvents: 'none',
          }}>AI ✦</span>
        )}
      </div>

      {/* Kết quả gợi ý của AI (dropdown) */}
      {aiResult && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
          background: 'white', borderRadius: '18px',
          border: '1px solid #e0e7ff',
          boxShadow: '0 20px 50px rgba(99,102,241,0.15)',
          padding: '18px 20px',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
        }}>
          <style>{'@keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }'}</style>
          
          {/* Nhãn AI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gemini AI gợi ý</span>
          </div>
          
          {/* Lời nhận xét của AI */}
          <p style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: '#475569', lineHeight: '1.5', fontStyle: 'italic' }}>
            "{aiResult.message}"
          </p>

          {aiResult.matches?.length > 0 && (
            <>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sản phẩm phù hợp nhất
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {aiResult.matches.map((name, i) => (
                  <span key={i} style={{
                    padding: '6px 14px', background: '#eef2ff', color: '#4338ca',
                    borderRadius: '99px', fontSize: '0.88rem', fontWeight: '700',
                    border: '1px solid #c7d2fe',
                  }}>
                    {name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
    </div>
  );
}
