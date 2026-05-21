import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PortalSelection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Decorative background elements to match Landing Page */}
      <div style={{...circle, top: '10%', left: '5%', width: '150px', height: '150px', background: '#e0f7fa', opacity: 0.5}}></div>
      <div style={{...circle, bottom: '10%', right: '5%', width: '200px', height: '200px', background: '#ffdde1', opacity: 0.4}}></div>

      <div style={{...contentWrapper, padding: isMobile ? '40px 20px' : '20px'}} className="fade-in">
        <h2 style={topTagline}>Access Control</h2>
        <h1 style={{...titleStyle, fontSize: isMobile ? '32px' : '48px'}}>Select Your Portal</h1>
        <p style={{...subtitleStyle, fontSize: isMobile ? '16px' : '18px'}}>
          Choose your gateway to the digital library ecosystem.
        </p>

        <div style={{...cardGrid, flexDirection: isMobile ? 'column' : 'row'}}>
          
          {/* User Portal Card */}
          <div 
            onMouseEnter={() => setHoveredCard('user')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/user-login')}
            style={{
              ...portalCard,
              transform: hoveredCard === 'user' ? 'translateY(-15px)' : 'translateY(0)',
              borderColor: hoveredCard === 'user' ? '#4facfe' : 'rgba(255,255,255,0.5)',
              boxShadow: hoveredCard === 'user' ? '0 30px 60px rgba(79, 172, 254, 0.2)' : '0 20px 40px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{
              ...iconBox, 
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              transform: hoveredCard === 'user' ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
            }}>👤</div>
            <h2 style={cardTitle}>User Portal</h2>
            <p style={cardDesc}>Browse the collection, borrow digital resources, and manage your personal reading list.</p>
            <div style={{...actionLink, color: '#4facfe'}}>User login</div>
          </div>

          {/* Admin Portal Card */}
          <div 
            onMouseEnter={() => setHoveredCard('admin')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/admin-login')}
            style={{
              ...portalCard,
              transform: hoveredCard === 'admin' ? 'translateY(-15px)' : 'translateY(0)',
              borderColor: hoveredCard === 'admin' ? '#7928ca' : 'rgba(255,255,255,0.5)',
              boxShadow: hoveredCard === 'admin' ? '0 30px 60px rgba(121, 40, 202, 0.2)' : '0 20px 40px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{
              ...iconBox, 
              background: 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)',
              transform: hoveredCard === 'admin' ? 'scale(1.1) rotate(-5deg)' : 'scale(1)'
            }}>🛡️</div>
            <h2 style={cardTitle}>Admin Portal</h2>
            <p style={cardDesc}>Full administrative power to update inventory, track analytics, and manage member accounts.</p>
            <div style={{...actionLink, color: '#7928ca'}}>System Control →</div>
          </div>

        </div>
        
        <button onClick={() => navigate('/')} style={backBtn}>
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden'
};

const circle = {
  position: 'absolute',
  borderRadius: '50%',
  zIndex: 0
};

const contentWrapper = { 
  maxWidth: '1000px', 
  width: '100%',
  zIndex: 1
};

const topTagline = {
  color: '#7928ca',
  fontSize: '14px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '10px'
};

const titleStyle = { 
  fontWeight: '800', 
  color: '#2d3436', 
  marginBottom: '15px',
  letterSpacing: '-1px'
};

const subtitleStyle = { 
  color: '#636e72', 
  maxWidth: '500px', 
  margin: '0 auto 50px',
  lineHeight: '1.6'
};

const cardGrid = { 
  display: 'flex', 
  gap: '20px', // Reduced from 30px
  justifyContent: 'center', 
  alignItems: 'stretch'
};

const portalCard = {
  flex: 1,
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(20px)',
  padding: '35px 25px', // Reduced from 50px 35px
  borderRadius: '35px', // Slightly smaller radius for a tighter look
  border: '2px solid rgba(255,255,255,0.5)',
  cursor: 'pointer',
  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '320px' // Reduced from 380px
};

const iconBox = {
  width: '70px',  // Reduced from 90px
  height: '70px', // Reduced from 90px
  borderRadius: '20px', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '32px', // Reduced from 40px
  color: 'white',
  marginBottom: '20px', // Reduced from 30px
  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.5s ease'
};

const cardTitle = { 
  fontSize: '22px', // Reduced from 26px
  fontWeight: '800', 
  color: '#1a1a1a', 
  margin: '0 0 10px 0' 
};

const cardDesc = { 
  fontSize: '14px', // Reduced from 15px
  color: '#576574', 
  lineHeight: '1.6', 
  marginBottom: '20px', // Reduced from 30px
  minHeight: '60px' // Adjusted for smaller text
};

const actionLink = {
  fontWeight: '700',
  fontSize: '16px',
  marginTop: 'auto'
};

const backBtn = {
  marginTop: '60px',
  background: 'none',
  border: 'none',
  color: '#636e72',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '15px',
  transition: '0.3s'
};

export default PortalSelection;