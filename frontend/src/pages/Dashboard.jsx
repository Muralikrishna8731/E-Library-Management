import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Star, LogOut, Library, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMobileMenu(false);
    };
    window.addEventListener('resize', handleResize);

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      navigate('/user-login');
      return;
    }
    setUserName(name || 'Reader');

    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (err) { console.error("Fetch error:", err); }
    };
    fetchBooks();
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const sidebarWidth = '260px';

  const styles = {
    dashboardBody: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden',
      position: 'relative'
    },
    sidebar: {
      width: sidebarWidth,
      backgroundColor: '#0f172a',
      padding: '32px 16px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      bottom: 0,
      // FIX: Ensure it is COMPLETELY hidden when off-screen
      left: isMobile ? (showMobileMenu ? '0' : '-100%') : '0',
      zIndex: 2000,
      transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#f8fafc',
      boxShadow: isMobile && showMobileMenu ? '10px 0 30px rgba(0,0,0,0.3)' : 'none'
    },
    mainContent: {
      flex: 1,
      // FIX: Remove margin entirely on mobile so content isn't pushed
      marginLeft: isMobile ? '0' : sidebarWidth,
      width: '100%',
      // FIX: Extra top padding on mobile to clear the absolute-positioned menu icon
      padding: isMobile ? '80px 20px 40px' : '40px 60px',
      boxSizing: 'border-box',
      minHeight: '100vh',
      transition: 'margin-left 0.4s ease'
    },
    mobileHeader: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      display: isMobile ? 'block' : 'none',
      zIndex: 100,
      cursor: 'pointer',
      color: '#0f172a'
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 1500,
      opacity: showMobileMenu ? 1 : 0,
      visibility: showMobileMenu ? 'visible' : 'hidden',
      transition: '0.3s ease'
    }
  };

  return (
    <div style={styles.dashboardBody}>
      {/* 1. Mobile Hamburger Icon (Always Visible on mobile) */}
      <div style={styles.mobileHeader} onClick={() => setShowMobileMenu(true)}>
        <Menu size={28} strokeWidth={2.5} />
      </div>

      {/* 2. Dimmed Overlay when menu is open */}
      <div style={styles.overlay} onClick={() => setShowMobileMenu(false)} />

      {/* 3. Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Library size={28} color="#6366f1" strokeWidth={2.5} />
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>BookNest</h2>
          </div>
          {isMobile && <X onClick={() => setShowMobileMenu(false)} style={{ cursor: 'pointer' }} />}
        </div>
        
        <nav style={{ flex: 1 }}>
          <div style={activeNavItem}><Home size={20} style={iconStyle} /> Home</div>
          <div style={navItem}><BookOpen size={20} style={iconStyle} /> Catalog</div>
          <div style={navItem}><Star size={20} style={iconStyle} /> Favorites</div>
        </nav>

        <button onClick={() => {localStorage.clear(); navigate('/user-login');}} style={logoutBtn}>
          <LogOut size={18} style={iconStyle} /> Logout
        </button>
      </aside>

      {/* 4. Main Content */}
      <main style={styles.mainContent}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', lineHeight: 1.2 }}>
  Happy Reading, <br style={{display: isMobile ? 'block' : 'none'}}/> 
  {userName.charAt(0).toUpperCase() + userName.slice(1)}!
</h1>
            {!isMobile && <p style={{color: '#64748b', marginTop: '5px'}}>Access your digital library resources.</p>}
          </div>
          <div style={avatarStyle}>{userName.charAt(0).toUpperCase()}</div>
        </header>

        <section>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Available Collection</h2>
            <span style={{background: '#e2e8f0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold'}}>{books.length} Books</span>
          </div>

          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {books.length > 0 ? books.map(book => (
              <div key={book._id} style={cardStyle}>
                <div style={{width: '50px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px'}}>
                  <BookOpen size={24} color="#6366f1" />
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '17px' }}>{book.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{book.author}</p>
                <button style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', fontWeight: 'bold', cursor: 'pointer'}}>View Book</button>
              </div>
            )) : (
              <div style={emptyStyle}>
                 <BookOpen size={48} color="#cbd5e1" style={{marginBottom: '15px'}} />
                 <p style={{margin: 0, fontWeight: '600'}}>Your library is empty.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// Reusable mini-styles
const navItem = { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#94a3b8', cursor: 'pointer', marginBottom: '8px' };
const activeNavItem = { ...navItem, backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', borderLeft: '4px solid #6366f1' };
const iconStyle = { marginRight: '12px' };
const logoutBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', background: 'none', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', width: '100%' };
const avatarStyle = { width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', transition: '0.3s' };
const emptyStyle = { gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', border: '2px dashed #e2e8f0', borderRadius: '24px', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center' };

export default Dashboard;