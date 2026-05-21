import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- Logic State ---
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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
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

      const { role } = jwtDecode(data.token);

      if (role !== 'admin') {
        localStorage.removeItem('libraria_token');
        setError('Access denied. Admin only.');
        setPassword('');
        return;
      }

      localStorage.setItem('libraria_token', data.token);
      navigate('/admin-dashboard');
    } catch (_error) {
      localStorage.removeItem('libraria_token');
      setError('Invalid email or password');
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dynamic Responsive Styles ---
  const dynamicLoginCard = {
    ...loginCard,
    width: isMobile ? '90%' : '400px',
    padding: isMobile ? '40px 25px' : '50px 40px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' 
  };

  const dynamicTitle = {
    ...titleStyle,
    fontSize: isMobile ? '24px' : '28px'
  };

  return (
    <div style={containerStyle}>
      <div style={dynamicLoginCard}>
        <button onClick={() => navigate('/get-started')} style={backArrow}>←</button>
        
        <div style={headerSection}>
          <div style={iconCircle}>🛡️</div>
          <h1 style={dynamicTitle}>Admin Access</h1>
          <p style={subtitleStyle}>Strictly for authorized personnel only.</p>
        </div>

        {error && (
          <div style={errorBanner}>
              ⚠️ {error}
          </div>
        )}

        <form style={formStyle} onSubmit={handleAdminLogin}>
          <div style={inputGroup}>
            <label htmlFor="admin-email" style={labelStyle}>Admin ID</label>
            <input 
              id="admin-email"
              type="email" 
              required
              placeholder="admin@libraria.com" 
              style={inputStyle} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#7928ca'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
          </div>

          <div style={inputGroup}>
            <label htmlFor="admin-password" style={labelStyle}>Security Password</label>
            <input 
              id="admin-password"
              type="password" 
              required
              placeholder="••••••••" 
              style={inputStyle} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#7928ca'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
          </div>

          <button 
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...loginBtn,
              background: isHovered ? '#6c1fb5' : '#7928ca',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHovered ? '0 10px 20px rgba(121, 40, 202, 0.2)' : 'none'
            }}>
            {isSubmitting ? 'Authorizing...' : 'Authorize Access'}
          </button>
        </form>

        <p style={footerText}>
          Lost your key? <span style={helpLink}>Contact System Admin</span>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---

const errorBanner = {
  background: '#fff5f5',
  color: '#c0392b',
  padding: '12px',
  borderRadius: '10px',
  fontSize: '11px',
  fontWeight: '600',
  marginBottom: '20px',
  border: '1px solid #feb2b2',
  textAlign: 'center',
  lineHeight: '1.4'
};

const containerStyle = {
  height: '100vh', width: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #e4efe9 100%)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
};

const loginCard = {
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)', borderRadius: '35px',
  border: '1px solid rgba(255, 255, 255, 0.5)', 
  boxShadow: '0 40px 70px rgba(0,0,0,0.08)', 
  position: 'relative',
  boxSizing: 'border-box' // Important for responsive padding
};

const backArrow = { position: 'absolute', top: '25px', left: '20px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#636e72' };
const headerSection = { textAlign: 'center', marginBottom: '30px' };
const iconCircle = { width: '60px', height: '60px', background: 'rgba(121, 40, 202, 0.1)', color: '#7928ca', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', margin: '0 auto 15px' };
const titleStyle = { fontWeight: '800', color: '#1a1a1a', margin: '0 0 5px 0' };
const subtitleStyle = { fontSize: '13px', color: '#636e72', fontWeight: '500' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#2d3436', marginLeft: '5px' };
const inputStyle = { padding: '14px 16px', borderRadius: '12px', border: '1px solid #dfe6e9', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.7)', transition: 'all 0.3s ease', width: '100%', boxSizing: 'border-box' };
const loginBtn = { padding: '16px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: 'all 0.3s ease' };
const footerText = { textAlign: 'center', fontSize: '13px', color: '#636e72', marginTop: '25px' };
const helpLink = { color: '#1a1a1a', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' };

export default AdminLogin;
