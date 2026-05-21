import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PortalSelection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // --- Responsive Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{...contentWrapper, padding: isMobile ? '40px 20px' : '20px'}} className="fade-in">
        <h1 style={{...titleStyle, fontSize: isMobile ? '32px' : '42px'}}>Select Your Portal</h1>
        <p style={{...subtitleStyle, fontSize: isMobile ? '16px' : '18px', marginBottom: isMobile ? '30px' : '50px'}}>
          Please choose your access level to continue to the system.
        </p>

        <div style={{...cardGrid, flexDirection: isMobile ? 'column' : 'row'}}>
          {/* User Portal Card */}
          <div 
            onMouseEnter={() => !isMobile && setHoveredCard('user')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
            onClick={() => navigate('/user-login')}
            style={{
              ...portalCard,
              width: isMobile ? '100%' : '320px',
              transform: hoveredCard === 'user' ? 'translateY(-10px)' : 'translateY(0)',
              border: hoveredCard === 'user' ? '1px solid #4facfe' : '1px solid rgba(255,255,255,0.3)',
              boxShadow: hoveredCard === 'user' ? '0 20px 40px rgba(79, 172, 254, 0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div style={iconCircle}>👤</div>
            <h2 style={cardTitle}>User Portal</h2>
            <p style={cardDesc}>Browse the collection, view digital resources, and manage your personal dashboard.</p>
            <button style={cardBtn}>User Login</button>
          </div>

          {/* Admin Portal Card */}
          <div 
            onMouseEnter={() => !isMobile && setHoveredCard('admin')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
            onClick={() => navigate('/admin-login')}
            style={{
              ...portalCard,
              width: isMobile ? '100%' : '320px',
              transform: hoveredCard === 'admin' ? 'translateY(-10px)' : 'translateY(0)',
              border: hoveredCard === 'admin' ? '1px solid #7928ca' : '1px solid rgba(255,255,255,0.3)',
              boxShadow: hoveredCard === 'admin' ? '0 20px 40px rgba(121, 40, 202, 0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{...iconCircle, background: 'rgba(121, 40, 202, 0.1)', color: '#7928ca'}}>🛡️</div>
            <h2 style={cardTitle}>Admin Portal</h2>
            <p style={cardDesc}>Full administrative control to manage inventory, track analytics, and oversee users.</p>
            <button style={{...cardBtn, background: '#7928ca'}}>Admin Login</button>
          </div>
        </div>
        
        <button onClick={() => navigate('/')} style={{...backBtn, marginTop: isMobile ? '30px' : '50px'}}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  minHeight: '100vh', // Changed to minHeight for better scrolling on small devices
  width: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #e4efe9 100%)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  boxSizing: 'border-box'
};

const contentWrapper = { 
  maxWidth: '900px', 
  width: '100%',
  boxSizing: 'border-box' 
};

const titleStyle = { fontWeight: '800', color: '#2d3436', marginBottom: '10px' };

const subtitleStyle = { color: '#636e72' };

const cardGrid = { 
  display: 'flex', 
  gap: '20px', 
  justifyContent: 'center', 
  alignItems: 'center'
};

const portalCard = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(15px)',
  padding: '40px 30px',
  borderRadius: '30px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  maxWidth: '350px' // Added for better mobile control
};

const iconCircle = {
  width: '80px',
  height: '80px',
  background: 'rgba(79, 172, 254, 0.1)',
  color: '#4facfe',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '40px',
  marginBottom: '20px'
};

const cardTitle = { fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 15px 0' };

const cardDesc = { fontSize: '15px', color: '#576574', lineHeight: '1.5', marginBottom: '30px' };

const cardBtn = {
  padding: '12px 25px',
  background: '#1a1a1a',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%' // Better for mobile taps
};

const backBtn = {
  background: 'none',
  border: 'none',
  color: '#636e72',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '15px',
  padding: '10px' // Increased hit area
};

export default PortalSelection;