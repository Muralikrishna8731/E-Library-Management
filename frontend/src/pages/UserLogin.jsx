import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  
  // --- Form & Animation States ---
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
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
          <div style={iconCircle}>{isLogin ? '👤' : '📝'}</div>
          <h1 style={{...titleStyle, fontSize: isMobile ? '26px' : '30px'}}>
            {isLogin ? 'User Login' : 'Create Account'}
          </h1>
          <p style={subtitleStyle}>
            {isLogin ? 'Access your digital library dashboard.' : 'Join the modern library system today.'}
          </p>
        </div>

        <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
          {/* New Field for Sign Up */}
          {!isLogin && (
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="John Doe" style={inputStyle} />
            </div>
          )}

          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" placeholder="user@example.com" style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>

          {isLogin && (
            <div style={actionRow}>
              <label style={rememberMeStyle}>
                <input type="checkbox" style={{marginRight: '6px'}} /> Remember me
              </label>
              <span style={forgotPass}>Forgot Password?</span>
            </div>
          )}

          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/dashboard')}
            style={{
              ...loginBtn,
              background: isHovered ? '#1a1a1a' : '#2d3436',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}>
            {isLogin ? 'Sign In' : 'Register Now'}
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

const actionRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const rememberMeStyle = { fontSize: '12px', color: '#636e72', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const forgotPass = { fontSize: '12px', color: '#4facfe', fontWeight: '700', cursor: 'pointer' };

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

const footerText = { textAlign: 'center', fontSize: '14px', color: '#636e72', marginTop: '25px' };

const toggleLink = { 
  color: '#4facfe', 
  fontWeight: '700', 
  cursor: 'pointer',
  textDecoration: 'underline',
  marginLeft: '5px'
};

export default UserLogin;