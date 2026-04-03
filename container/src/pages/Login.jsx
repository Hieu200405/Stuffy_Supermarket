import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = isLogin 
      ? await login(email, password)
      : await register(name, email, password);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '800' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      {error && <div style={{ padding: '10px', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}>
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}
