import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserLogin = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.token) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('libraria_token', data.token);
      navigate('/library');
    } catch (_error) {
      setError('Invalid email or password');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{
        ...loginCard,
        width: isMobile ? '90%' : '420px',
        padding: isMobile ? '40px 25px' : '50px 40px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/get-started')} 
          style={{...backArrow, top: isMobile ? '20px' : '30px', left: isMobile ? '20px' : '30px'}}
        >
          ←
        </button>
        
        <div style={headerSection}>
          <div style={iconCircle}>👤</div>
          <h1 style={{...titleStyle, fontSize: isMobile ? '26px' : '30px'}}>User Login</h1>
          <p style={subtitleStyle}>Access your digital library dashboard.</p>
        </div>

        {error && <div style={errorBanner}>⚠️ {error}</div>}

        <form style={formStyle} onSubmit={handleLogin}>
          <div style={inputGroup}>
            <label htmlFor="user-email" style={labelStyle}>Email Address</label>
            <input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              style={inputStyle}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <label htmlFor="user-password" style={labelStyle}>Password</label>
            <input
              id="user-password"
              type="password"
              placeholder="••••••••"
              style={inputStyle}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...loginBtn,
              background: isHovered ? '#1a1a1a' : '#2d3436',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #e4efe9 100%)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'auto',
  padding: '20px 0'
};

const loginCard = {
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '35px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 40px 70px rgba(0,0,0,0.08)',
  position: 'relative',
  boxSizing: 'border-box'
};

const backArrow = {
  position: 'absolute',
  background: 'none',
  border: 'none',
  fontSize: '22px',
  cursor: 'pointer',
  color: '#636e72',
};

const headerSection = { textAlign: 'center', marginBottom: '25px' };

const iconCircle = {
  width: '60px',
  height: '60px',
  background: 'rgba(79, 172, 254, 0.1)',
  color: '#4facfe',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '28px',
  margin: '0 auto 15px'
};

const titleStyle = { fontWeight: '800', color: '#1a1a1a', margin: '0 0 5px 0' };
const subtitleStyle = { fontSize: '14px', color: '#636e72', fontWeight: '500' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#2d3436', marginLeft: '5px' };
const errorBanner = {
  background: '#fff5f5',
  color: '#c0392b',
  padding: '12px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: '600',
  marginBottom: '20px',
  border: '1px solid #feb2b2',
  textAlign: 'center',
  lineHeight: '1.4',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 18px',
  borderRadius: '12px',
  border: '1px solid #dfe6e9',
  fontSize: '14px',
  outline: 'none',
  background: 'rgba(255,255,255,0.7)',
};

const loginBtn = {
  padding: '16px',
  borderRadius: '12px',
  border: 'none',
  color: 'white',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'all 0.3s ease'
};

export default UserLogin;
