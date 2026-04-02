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
    console.error('[ErrorBoundary] Uncaught error in MFE component:', error, errorInfo);
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
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Something went wrong
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#b91c1c', fontSize: '0.9rem', lineHeight: 1.5 }}>
            This module encountered an error and has been isolated. Other parts of the application continue to work normally.
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
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
