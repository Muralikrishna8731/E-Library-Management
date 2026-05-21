import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  
  // --- UI & Responsiveness States ---
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  
  // --- Form Data & Backend Feedback ---
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(''); 
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin && formData.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters long.";
    }
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    // Dynamically choose endpoint based on form mode
    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        // Handle successful Login
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        navigate('/dashboard');
      } else {
        // Handle successful Registration
        alert("Account created successfully! Please log in.");
        setIsLogin(true); // Switch to login view
        setFormData({ fullName: '', email: '', password: '' });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ fullName: '', email: '', password: '' });
  };

  return (
    <div style={containerStyle}>
      <div style={{
        ...loginCard,
        width: isMobile ? '90%' : '420px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}>
        <button onClick={() => navigate('/get-started')} style={backArrow}>←</button>
        
        <div style={headerSection}>
          <div style={iconCircle}>{isLogin ? '👤' : '📝'}</div>
          <h1 style={{...titleStyle, fontSize: isMobile ? '26px' : '30px'}}>
            {isLogin ? 'User Login' : 'Create Account'}
          </h1>
          {error && <div style={errorBanner}>{error}</div>}
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input 
                name="fullName"
                type="text" 
                placeholder="Your Name" 
                style={inputStyle} 
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="user@example.com" 
              style={inputStyle} 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              style={inputStyle} 
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              ...loginBtn,
              background: loading ? '#636e72' : '#2d3436',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Connecting...' : (isLogin ? 'Sign In' : 'Register Now')}
          </button>
        </form>

        <p style={footerText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={toggleLink} onClick={toggleMode}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---

const errorBanner = {
  background: '#fff2f0',
  color: '#ff4d4f',
  border: '1px solid #ffccc7',
  padding: '10px',
  borderRadius: '12px',
  fontSize: '13px',
  marginTop: '15px',
  fontWeight: '600',
  textAlign: 'center'
};

const containerStyle = {
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #e4efe9 100%)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0'
};

const loginCard = {
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '35px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 40px 70px rgba(0,0,0,0.08)',
  padding: '50px 40px',
  position: 'relative',
  boxSizing: 'border-box'
};

const backArrow = {
  position: 'absolute', top: '30px', left: '30px',
  background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#636e72',
};

const headerSection = { textAlign: 'center', marginBottom: '25px' };
const iconCircle = {
  width: '60px', height: '60px', background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe',
  borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', margin: '0 auto 10px'
};

const titleStyle = { fontWeight: '800', color: '#1a1a1a', margin: '0' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#2d3436', marginLeft: '5px' };

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '14px 18px', borderRadius: '12px',
  border: '1px solid #dfe6e9', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.7)',
};

const loginBtn = {
  padding: '16px', borderRadius: '12px', border: 'none', color: 'white',
  fontWeight: '700', fontSize: '16px', marginTop: '10px', transition: 'all 0.3s ease'
};

const footerText = { textAlign: 'center', fontSize: '14px', color: '#636e72', marginTop: '25px' };
const toggleLink = { color: '#4facfe', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' };

export default UserLogin;