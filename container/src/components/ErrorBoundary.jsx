import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔥 MFE Component BỐC CHÁY MẤT KIỂM SOÁT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '25px', 
          border: '2px dashed #ef4444', 
          borderRadius: '16px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444',
          margin: '10px 0',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚧</span> Khu Vực Đang Bảo Trì Khẩn Cấp
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>
            Hệ thống Micro Frontend này đã gặp sự cố và tự động đóng băng để tránh lan truyền cháy sang Server khác. Các khu vực khác trong siêu thị vẫn bán hàng bình thường!
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)'
            }}
          >
            🔄 Kết nối lại Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
