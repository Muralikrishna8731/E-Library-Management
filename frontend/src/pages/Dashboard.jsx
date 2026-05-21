// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Home, BookOpen, Star, LogOut, Library, Menu, X, ExternalLink, Download, CheckCircle, Search, Loader2, ArrowLeft, Sparkles, Clock, Trash2, History } from 'lucide-react';

// const Dashboard = () => {
//   // --- Core Structural Hooks ---
//   const navigate = useNavigate();
//   const [adminBooks, setAdminBooks] = useState([]); // Books from MongoDB
//   const [apiBooks, setApiBooks] = useState([]);     // Books from Open Library API
//   const [homeDiscoveryBooks, setHomeDiscoveryBooks] = useState([]); // Dynamic randomized discovery feed for Home
//   const [userName, setUserName] = useState('');
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
  
//   // Dynamic API Load, Category, & Search States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState(null); 
//   const [loading, setLoading] = useState(false);
  
//   // Tab Navigation state
//   const [activeTab, setActiveTab] = useState('home'); // 'home', 'catalog', 'favorites', 'downloads', 'history'
  
//   // Favorites backend array state
//   const [starredBooks, setStarredBooks] = useState([]);

//   // Persistent local storage downloads cache array
//   const [downloadedIds, setDownloadedIds] = useState(() => {
//     const savedDownloads = localStorage.getItem('userDownloads');
//     return savedDownloads ? JSON.parse(savedDownloads) : [];
//   });

//   // Persistent local storage reading history track
//   const [viewedHistory, setViewedHistory] = useState(() => {
//     const savedHistory = localStorage.getItem('userReadingHistory');
//     return savedHistory ? JSON.parse(savedHistory) : [];
//   });

//   // Complete Curated Categories Matrix (25 Collections)
//    const categoriesList = [
//     { name: 'Textbooks', image: 'https://thumbs.dreamstime.com/b/education-school-university-books-college-classes-16441446.jpg', color: '#eff6ff' },
//     { name: 'Fiction', image: 'https://fivebooks.com/images/brjfwPAq69-IDEX2/plain/fb/2022/11/fiction-books-category-share-image.jpg', color: '#fdf2f8' },
//     { name: 'Novels', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=60', color: '#f0fdf4' },
//     { name: 'Story Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=60', color: '#fffbeb' },
//     { name: 'Computers & Tech', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
//     { name: 'History', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&auto=format&fit=crop&q=60', color: '#fdf6f7' },
//     { name: 'Science', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' },
//     { name: 'Poetry', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=60', color: '#fff1f2' },
//    { name: 'Psychology', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop&q=60', color: '#fff1f2' },
//     { name: 'Engineering', image: 'https://darnelltechnical.com/wp-content/uploads/2020/12/WhatDoesAnEngineeringDesignerDo-scaled-e1608840423998.jpg', color: '#ecfeff' },
//     { name: 'Biography', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60', color: '#fef2f2' },
//     { name: 'Business & Finance', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60', color: '#f0fdf4' },
//     { name: 'Photography', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' },
//     { name: 'Travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=60', color: '#eff6ff' },
//     { name: 'Cooking & Wine', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=60', color: '#fffbeb' },
//     { name: 'Games', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
//     { name: 'Art', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&auto=format&fit=crop&q=60', color: '#fdf2f8' },
//     { name: 'Drama', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
//     { name: 'Law', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60', color: '#f1f5f9' },
//    { name: 'Spirituality', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' }
//   ];

//   const mapApiDocs = (docs, fallbackCategory = '') => {
//     return (docs || []).map((doc) => {
//       const iaId = doc.ia && doc.ia[0];
//       const coverId = doc.cover_i;
      
//       return {
//         _id: doc.key,
//         title: doc.title,
//         author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
//         pdfUrl: iaId ? `https://archive.org/download/${iaId}/${iaId}.pdf` : null,
//         viewUrl: iaId ? `https://archive.org/details/${iaId}/mode/2up` : null,
//         coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null,
//         category: fallbackCategory,
//         isAdminUploaded: false
//       };
//     });
//   };

//   const shuffleArray = (array) => {
//     let shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   const fetchHybridCollection = async (apiSearchTerm) => {
//     if (!apiSearchTerm) return;
//     setLoading(true);
//     try {
//       const localResponse = await fetch('http://localhost:5000/api/books');
//       let localData = [];
//       if (localResponse.ok) localData = await localResponse.json();

//       const apiResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(apiSearchTerm)}&limit=100`);
//       let apiData = [];
//       if (apiResponse.ok) {
//         const parsedApi = await apiResponse.json();
//         apiData = mapApiDocs(parsedApi.docs, apiSearchTerm);
//       }

//       setAdminBooks(localData.map(book => ({ ...book, isAdminUploaded: true })));
//       setApiBooks(apiData);
//     } catch (err) {
//       console.error("Hybrid fetching failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) setShowMobileMenu(false);
//     };
//     window.addEventListener('resize', handleResize);

//     const token = localStorage.getItem('token');
//     const name = localStorage.getItem('userName');
//     const userId = localStorage.getItem('userId'); 
    
//     if (!token) {
//       navigate('/user-login');
//       return;
//     }
//     setUserName(name || 'Reader');

//     const fetchUserStars = async () => {
//       if (!userId || userId === "undefined") return;
//       try {
//         const response = await fetch(`http://localhost:5000/api/auth/user-stars/${userId}`);
//         const data = await response.json();
//         if (response.ok) setStarredBooks(data.starredBooks || []);
//       } catch (err) { console.error(err); }
//     };

//     const loadHomePageData = async () => {
//       setLoading(true);
//       try {
//         const localResponse = await fetch('http://localhost:5000/api/books');
//         let localBooks = [];
//         if (localResponse.ok) {
//           const data = await localResponse.json();
//           localBooks = data.map(b => ({ ...b, isAdminUploaded: true }));
//           setAdminBooks(localBooks);
//         }
        
//         const mixedCategories = shuffleArray(categoriesList).slice(0, 3);
//         const apiPromises = mixedCategories.map(cat => 
//           fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(cat.name)}&limit=50`)
//             .then(res => res.ok ? res.json() : { docs: [] })
//             .then(parsed => mapApiDocs(parsed.docs, cat.name))
//             .catch(() => [])
//         );
        
//         const results = await Promise.all(apiPromises);
//         setHomeDiscoveryBooks(shuffleArray(results.flat()));

//       } catch(e) { 
//         console.error("Error generating home rows:", e); 
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserStars();
//     loadHomePageData();

//     return () => window.removeEventListener('resize', handleResize);
//   }, [navigate]);

//  const handleSearchSubmit = (e, type = 'all') => {
//   if (e) e.preventDefault();
  
//   // Example: if your API fetch looks for a type/mode parameter
//   fetchHybridCollection(searchQuery, type); 
// };
//   const handleCategorySelect = (categoryName) => {
//     setSelectedCategory(categoryName);
//     fetchHybridCollection(categoryName);
//   };

//   const handleViewBook = (book) => {
//     let dest = book.viewUrl || book.pdfUrl;
//     if (!dest) return alert("Viewing document URL profile unlinked.");

//     if (book.isAdminUploaded && !dest.startsWith('http')) {
//       let cleanPath = dest.replace(/\\/g, '/');
//       if (cleanPath.startsWith('/')) {
//         cleanPath = cleanPath.substring(1);
//       }
//       dest = `http://localhost:5000/${cleanPath}`;
//     }

//     setViewedHistory(prev => {
//       const filtered = prev.filter(item => item._id !== book._id);
//       const updated = [book, ...filtered].slice(0, 40); 
//       localStorage.setItem('userReadingHistory', JSON.stringify(updated));
//       return updated;
//     });

//     window.open(dest, '_blank', 'noopener,noreferrer');
//   };

//   const handleDownloadBook = async (pdfUrl, title, bookId) => {
//     if (!pdfUrl) return alert("Download asset URL stream not found.");
    
//     // Fallback direct browser-driven link for external open library assets to circumvent CORS block lines
//     if (pdfUrl.startsWith('http')) {
//       const link = document.createElement('a');
//       link.href = pdfUrl;
//       link.target = '_blank';
//       link.rel = 'noopener noreferrer';
//       link.setAttribute('download', `${title}.pdf`); 
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setDownloadedIds(prev => {
//         const updated = prev.includes(bookId) ? prev : [...prev, bookId];
//         localStorage.setItem('userDownloads', JSON.stringify(updated));
//         return updated;
//       });
//       return;
//     }

//     let targetUrl = pdfUrl;
//     if (!pdfUrl.startsWith('http')) {
//       let cleanPath = pdfUrl.replace(/\\/g, '/');
//       if (cleanPath.startsWith('/')) {
//         cleanPath = cleanPath.substring(1);
//       }
//       targetUrl = `http://localhost:5000/${cleanPath}`;
//     }

//     try {
//       const response = await fetch(targetUrl);
//       if (!response.ok) throw new Error("Fetch pipeline link broke.");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${title}.pdf`); 
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       setDownloadedIds(prev => {
//         const updated = prev.includes(bookId) ? prev : [...prev, bookId];
//         localStorage.setItem('userDownloads', JSON.stringify(updated));
//         return updated;
//       });
//     } catch (err) {
//       alert("Automated server download blocked by original publisher or missing asset file.");
//     }
//   };

//   const handleRemoveDownload = (bookId) => {
//     setDownloadedIds(prev => {
//       const updated = prev.filter(id => id !== bookId);
//       localStorage.setItem('userDownloads', JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const clearEntireHistory = () => {
//     localStorage.removeItem('userReadingHistory');
//     setViewedHistory([]);
//   };

//   const toggleStar = async (bookId) => {
//     const userId = localStorage.getItem('userId');
//     if (!userId || userId === "undefined") return;
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/star-toggle', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//         body: JSON.stringify({ userId, bookId })
//       });
//       const data = await response.json();
//       if (response.ok) setStarredBooks(data.starredBooks || []);
//     } catch (err) { console.error(err); }
//   };

//   const getDisplayBooks = () => {
//     const allKnownBooks = [...adminBooks, ...apiBooks, ...homeDiscoveryBooks];
//     if (activeTab === 'favorites') return allKnownBooks.filter(b => starredBooks.includes(b._id));
//     if (activeTab === 'downloads') return allKnownBooks.filter(b => downloadedIds.includes(b._id));
//     if (activeTab === 'history') return viewedHistory;
//     if (selectedCategory) {
//       return [...adminBooks, ...apiBooks].filter(book => 
//         !book.isAdminUploaded || 
//         (book.category && book.category.toLowerCase().includes(selectedCategory.toLowerCase()))
//       );
//     }
//     return [];
//   };

//   const displayBooks = getDisplayBooks();
//   const sidebarWidth = '260px';

//   const renderBookCard = (book) => (
//     <div key={book._id} style={styles.cardStyle} className="book-item-card">
//       {book.isAdminUploaded && <span style={styles.adminBadgeStyle}>Official</span>}
//       <button onClick={() => toggleStar(book._id)} style={styles.starBtnStyle} className="star-bounce">
//         <Star size={19} fill={starredBooks.includes(book._id) ? "#f59e0b" : "none"} color={starredBooks.includes(book._id) ? "#f59e0b" : "#94a3b8"} style={{ transition: 'all 0.2s' }} />
//       </button>

//       <div style={styles.coverContainerStyle}>
//         {(book.coverUrl || book.image) ? (
//           <img src={book.coverUrl || book.image} alt={book.title} style={styles.coverImageStyle} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
//         ) : null}
//         <div style={{ ...styles.coverPlaceholderStyle, display: (book.coverUrl || book.image) ? 'none' : 'flex', backgroundColor: book.isAdminUploaded ? '#e6f4ea' : '#eeeffe' }}>
//           <BookOpen size={32} color={book.isAdminUploaded ? '#10b981' : '#6366f1'} />
//           <span style={styles.placeholderTextStyle}>{book.title}</span>
//         </div>
//       </div>

//       <h3 title={book.title} style={styles.bookTitleStyle}>{book.title}</h3>
//       <p title={book.author} style={styles.bookAuthorStyle}>{book.author}</p>
      
//       <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', flexWrap: 'wrap' }}>
//         <button onClick={() => handleViewBook(book)} style={styles.viewBtnStyle} className="view-btn-hover"><ExternalLink size={14} /> View</button>
        
//         {activeTab === 'downloads' ? (
//           <button onClick={() => handleRemoveDownload(book._id)} style={styles.removeDwnbtnStyle} className="trash-btn-hover" title="Remove local storage trace link">
//             <Trash2 size={14} /> Remove
//           </button>
//         ) : downloadedIds.includes(book._id) ? (
//           <div style={styles.downloadedBadgeStyle}><CheckCircle size={14} /> Saved</div>
//         ) : (
//           <button disabled={!book.pdfUrl} onClick={() => handleDownloadBook(book.pdfUrl, book.title, book._id)} style={book.pdfUrl ? styles.downloadBtnStyle : styles.disabledDownloadBtnStyle} className={book.pdfUrl ? "download-btn-hover" : ""}><Download size={14} /> {book.pdfUrl ? 'Save' : 'Locked'}</button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ ...styles.dashboardBody }}>
//       <div style={styles.mobileHeader} onClick={() => setShowMobileMenu(true)}><Menu size={26} strokeWidth={2.2} /></div>
//       <div style={{ ...styles.overlay, opacity: showMobileMenu ? 1 : 0, visibility: showMobileMenu ? 'visible' : 'hidden' }} onClick={() => setShowMobileMenu(false)} />

//       <aside style={{ ...styles.sidebar, left: isMobile ? (showMobileMenu ? '0' : '-100%') : '0' }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setActiveTab('home'); setSelectedCategory(null); }}>
//             <Library size={26} color="#6366f1" strokeWidth={2.2} className="logo-spark" />
//             <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, letterSpacing: '-0.3px' }}>NoteNest</h2>
//           </div>
//           {isMobile && <X onClick={() => setShowMobileMenu(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />}
//         </div>
        
//         <nav style={{ flex: 1 }}>
//           <div onClick={() => { setActiveTab('home'); setSelectedCategory(null); setShowMobileMenu(false); }} style={activeTab === 'home' ? styles.activeNavItem : styles.navItem}><Home size={18} style={styles.iconStyle} /> Home</div>
//           <div onClick={() => { setActiveTab('catalog'); setSelectedCategory(null); setShowMobileMenu(false); }} style={activeTab === 'catalog' ? styles.activeNavItem : styles.navItem}><BookOpen size={18} style={styles.iconStyle} /> Catalog</div>
//           <div onClick={() => { setActiveTab('favorites'); setSelectedCategory(null); setShowMobileMenu(false); }} style={activeTab === 'favorites' ? styles.activeNavItem : styles.navItem}><Star size={18} style={styles.iconStyle} /> Favorites</div>
//           <div onClick={() => { setActiveTab('downloads'); setSelectedCategory(null); setShowMobileMenu(false); }} style={activeTab === 'downloads' ? styles.activeNavItem : styles.navItem}><Download size={18} style={styles.iconStyle} /> Downloads</div>
//           <div onClick={() => { setActiveTab('history'); setSelectedCategory(null); setShowMobileMenu(false); }} style={activeTab === 'history' ? styles.activeNavItem : styles.navItem}><History size={18} style={styles.iconStyle} /> History Track</div>
//         </nav>

//         <button onClick={() => { localStorage.clear(); navigate('/user-login'); }} style={styles.logoutBtn} className="btn-hover-effect"><LogOut size={16} style={styles.iconStyle} /> Logout</button>
//       </aside>

//       <main style={{ ...styles.mainContent, marginLeft: isMobile ? '0' : sidebarWidth }}>
//        <form
//   onSubmit={(e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
    
//     // 1. Set the UI title to show what author you searched for
//     if (typeof setSelectedCategory === 'function') {
//       setSelectedCategory(`Author: "${searchQuery}"`);
//     }
    
//     // 2. Call your search function explicitly passing 'author' as the mode
//     // (Assuming your fetch/submit function accepts a query and a type)
//     if (typeof handleSearchSubmit === 'function') {
//       handleSearchSubmit(e, 'author'); 
//     }
//   }}
//   style={isMobile ? styles.mobileSearchFormStyle : styles.searchFormStyle}
// >
//   <div style={styles.inputWrapperStyle}>
//     <Search size={16} color="#94a3b8" style={{ marginLeft: '14px' }} />
//     <input
//       type="text"
//       placeholder="Search by author name..."
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//       style={styles.searchInputStyle} // Add your input style variable here if needed
//     />
//   </div>
//   <button 
//     type="submit" 
//     style={isMobile ? styles.mobileSearchBtnStyle : styles.searchBtnStyle}
//   >
//     Search
//   </button>
// </form>

//         <div key={activeTab + (selectedCategory || '')} className="fade-in-view">
//           {activeTab === 'home' && (
//             <div style={styles.heroBannerCardStyle}>
//               <div style={{ flex: 1, zIndex: 2 }}>
//                 <div style={styles.badgeWrapperStyle}><Sparkles size={12} /> Dashboard Hub</div>
//                 <h2 style={{ fontSize: isMobile ? '20px' : '24px', margin: '12px 0', fontWeight: '600', letterSpacing: '-0.3px' }}>Welcome back to your Study Desk</h2>
//                 <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, maxWidth: '520px', lineHeight: 1.6 }}>
//                   Browse through files uploaded directly by your administrator or check out random highlights from across our comprehensive learning tracks.
//                 </p>
//               </div>
//               {!isMobile && <div style={{ fontSize: '64px', opacity: 0.8, userSelect: 'none', transform: 'rotate(10deg)', zIndex: 2 }}>📚</div>}
//               <div style={styles.bannerGlowEffect} />
//             </div>
//           )}

//           <section style={{ marginTop: '30px' }}>
//             {loading ? (
//               <div style={styles.loaderAreaStyle}>
//                 <Loader2 size={40} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
//                 <p style={{ marginTop: '12px', color: '#64748b', fontSize: '14px' }}>Assembling catalog layouts...</p>
//               </div>
//             ) : activeTab === 'catalog' && !selectedCategory ? (
//               <div>
//                 <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0f172a', letterSpacing: '-0.2px' }}>Browse Categories</h2>
//                 <div style={styles.shoppingGridStyle}>
//                   {categoriesList.map((cat) => (
//                     <div key={cat.name} onClick={() => handleCategorySelect(cat.name)} style={{ ...styles.categoryCardBoxStyle, backgroundColor: cat.color }} className="category-card">
//                       <div style={styles.imageContainerStyle}><img src={cat.image} alt={cat.name} style={styles.categoryImageStyle} /></div>
//                       <div style={styles.categoryTitleStyle}>{cat.name}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : activeTab === 'home' ? (
//               <div>
//                 {/* Row 1: Admin Collections */}
//                 <div style={{ marginBottom: '40px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//                     <Clock size={18} color="#6366f1" />
//                     <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a', letterSpacing: '-0.2px' }}>Recently Added</h2>
//                     <span style={styles.countBadgeStyle}>Official Releases</span>
//                   </div>
//                   {adminBooks.length > 0 ? (
//                     <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
//                       {adminBooks.map(book => renderBookCard(book))}
//                     </div>
//                   ) : (
//                     <div style={{ ...styles.emptyStyle, padding: '40px 20px' }}>
//                       <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>No administrator files have been posted to the backend yet.</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Row 2: Dynamic API Shuffled Discover Feed */}
//                 <div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//                     <Sparkles size={18} color="#10b981" />
//                     <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a', letterSpacing: '-0.2px' }}>Discover Feed</h2>
//                     <span style={{...styles.countBadgeStyle, backgroundColor: '#e6f4ea', color: '#137333'}}>Shuffled Collections</span>
//                   </div>
//                   <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
//                     {homeDiscoveryBooks.length > 0 ? homeDiscoveryBooks.map(book => renderBookCard(book)) : (
//                       <div style={styles.emptyStyle}>
//                         <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Pulling random streams...</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               // --- Catalog Sub-view / Favorites / Downloads / History Standard Layout Grid ---
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                     {activeTab === 'catalog' && selectedCategory && (
//                       <button onClick={() => setSelectedCategory(null)} style={styles.backBtnStyle} className="btn-hover-effect"><ArrowLeft size={14} /> Back</button>
//                     )}
//                     <h2 style={{ fontSize: '18px', fontWeight: '600', textTransform: 'capitalize', margin: 0, color: '#0f172a', letterSpacing: '-0.2px' }}>
//                       {selectedCategory ? selectedCategory : activeTab === 'history' ? 'Recently Viewed Track' : `${activeTab} Collection`}
//                     </h2>
//                     <span style={styles.countBadgeStyle}>{displayBooks.length} Items</span>
//                   </div>

//                   {activeTab === 'history' && displayBooks.length > 0 && (
//                     <button onClick={clearEntireHistory} style={styles.clearHistoryBtnStyle} className="btn-hover-effect">Wipe History</button>
//                   )}
//                 </div>

//                 <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
//                   {displayBooks.length > 0 ? displayBooks.map(book => renderBookCard(book)) : (
//                     <div style={styles.emptyStyle}>
//                        <BookOpen size={44} color="#cbd5e1" style={{marginBottom: '15px'}} />
//                        <h3 style={{ margin: '0 0 6px 0', color: '#475569', fontSize: '16px', fontWeight: '600' }}>Shelf is Empty</h3>
//                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>No items found matching this specific viewpoint context.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </main>

//       <style>{`
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        
//         .fade-in-view { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
//         .book-item-card { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important; }
//         .book-item-card:hover { transform: translateY(-4px); box-shadow: 0 16px 20px -4px rgba(15,23,42,0.06) !important; }
//         .category-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
//         .category-card:hover { transform: scale(1.02); box-shadow: 0 10px 15px -5px rgba(0,0,0,0.08) !important; }
//         .btn-hover-effect { transition: all 0.2s ease !important; }
//         .btn-hover-effect:hover { opacity: 0.95; transform: translateY(-0.5px); }
//         .view-btn-hover { transition: all 0.2s ease !important; }
//         .view-btn-hover:hover { background-color: rgba(99, 102, 241, 0.04) !important; transform: translateY(-0.5px); }
//         .download-btn-hover { transition: all 0.2s ease !important; }
//         .download-btn-hover:hover { background-color: #4f46e5 !important; transform: translateY(-0.5px); }
//         .trash-btn-hover { transition: all 0.2s ease !important; }
//         .trash-btn-hover:hover { background-color: #ef4444 !important; color: #fff !important; border-color: #ef4444 !important; transform: translateY(-0.5px); }
//         .star-bounce:hover { transform: scale(1.1); }
//         .logo-spark:hover { transform: scale(1.02); }
//       `}</style>
//     </div>
//   );
// };

// // --- Simple, Lightweight Geometric Text Font Variables Applied Below ---
// const systemFontStack = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// const styles = {
//   dashboardBody: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: systemFontStack, overflowX: 'hidden', position: 'relative' },
//   sidebar: { width: '260px', backgroundColor: '#0f172a', padding: '32px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, zIndex: 2000, transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)', color: '#f8fafc' },
//   mainContent: { flex: 1, width: '100%', padding: '40px 45px', boxSizing: 'border-box', minHeight: '100vh', transition: 'margin-left 0.4s ease' },
  
//   // Cleaned alignment positions for mobile layout parameters
//   mobileHeader: { position: 'absolute', top: '24px', left: '24px', display: 'block', zIndex: 100, cursor: 'pointer', color: '#0f172a' },
//   headerLayoutBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px', flexWrap: 'wrap', gap: '20px', paddingLeft: window.innerWidth < 768 ? '40px' : '0', paddingTop: window.innerWidth < 768 ? '4px' : '0' ,marginTop:'30px'},
//   welcomeTitleStyle: { margin: 0, fontSize: window.innerWidth < 768 ? '32px' : '28px', fontWeight: '600', color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 ,marginTop:'20px'},
//   overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.15)', backdropFilter: 'blur(2px)', zIndex: 1500, transition: 'opacity 0.3s ease, visibility 0.3s ease' },
  
//   navItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#94a3b8', cursor: 'pointer', marginBottom: '6px', borderRadius: '8px', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s ease' },
//   activeNavItem: { display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: '6px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontWeight: '500', fontSize: '14px', borderLeft: '4px solid #6366f1' },
//   iconStyle: { marginRight: '14px' },
//   logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', background: 'none', color: '#f1f5f9', borderWidth: '1px', borderStyle: 'solid', borderColor: '#334155', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: '500', fontSize: '13px' },
  
//   cardStyle: { backgroundColor: '#fff', padding: '28px 18px 18px', borderRadius: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#e2e8f0', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column' },
//   adminBadgeStyle: { position: 'absolute', top: '14px', left: '14px', backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ceead6', zIndex: 10 },
//   starBtnStyle: { position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 },
  
//   bookTitleStyle: { margin: '0 0 4px 0', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '600', color: '#1e293b' },
//   bookAuthorStyle: { color: '#64748b', fontSize: '13px', marginBottom: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '400' },
  
//   viewBtnStyle: { flex: 1, padding: '9px 12px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#6366f1', color: '#6366f1', background: 'none', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' },
//   downloadBtnStyle: { flex: 1, padding: '9px 12px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' },
//   disabledDownloadBtnStyle: { flex: 1, padding: '9px 12px', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#94a3b8', border: 'none', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' },
//   downloadedBadgeStyle: { flex: 1, padding: '9px 12px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569', borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' },
//   removeDwnbtnStyle: { flex: 1, padding: '9px 12px', borderRadius: '8px', backgroundColor: '#fff', color: '#ef4444', borderWidth: '1px', borderStyle: 'solid', borderColor: '#fee2e2', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' },
//   emptyStyle: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', borderWidth: '1.5px', borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  
//   // Desktop configuration rules
//   searchFormStyle: { 
//     display: 'flex', 
//     alignItems: 'center', 
//     backgroundColor: '#fff', 
//     borderWidth: '1px', 
//     borderStyle: 'solid', 
//     borderColor: '#ffffff', 
//     borderRadius: '10px', 
//     overflow: 'hidden', 
//     width: '1000px', 
   
//     marginBottom:'40px'
//   },
//   searchBtnStyle: { 
//     padding: '12px 20px', 
//     backgroundColor: '#6366f1', 
//     color: '#fff', 
//     border: 'none', 
//     fontWeight: '500', 
//     cursor: 'pointer', 
//     fontSize: '13px', 
//     borderRadius:'10px',
//     fontFamily: systemFontStack 
//   },

//   // --- NEW: Fluid Mobile Layout Configuration Rules ---
//   mobileSearchFormStyle: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     width: '100%',
//     marginTop: '16px'
//   },
//   inputWrapperStyle: {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: '1px',
//     borderStyle: 'solid',
//     borderColor: '#ffffff',
//     borderRadius: '10px',
//     width: '100%'
//   },
//   mobileSearchBtnStyle: {
//     padding: '12px',
//     backgroundColor: '#6366f1',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '10px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     fontSize: '14px',
//     width: '100%',
//     textAlign: 'center',
//     fontFamily: systemFontStack,
//     boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.15)'
//   },

//   // Constant styling shared fields
//   searchInputStyle: { 
//     flex: 1, 
//     padding: '12px 10px', 
//     border: 'none', 
//     outline: 'none', 
//     fontSize: '14px', 
//     color: '#334155', 
//     fontWeight: '400', 
//     backgroundColor: 'transparent',
//     fontFamily: systemFontStack 
//   },
//   loaderAreaStyle: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', width: '100%' },
//   countBadgeStyle: { background: '#e2e8f0', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: '#475569' },
  
//   shoppingGridStyle: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', marginTop: '10px' },
//   categoryCardBoxStyle: { borderWidth: '1px', borderStyle: 'solid', borderColor: '#e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
//   imageContainerStyle: { width: '100%', height: '120px', borderRadius: '10px', overflow: 'hidden' },
//   categoryImageStyle: { width: '100%', height: '100%', objectFit: 'cover' },
//   categoryTitleStyle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
//   backBtnStyle: { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1', backgroundColor: '#fff', borderRadius: '8px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', color: '#475569' },
//   clearHistoryBtnStyle: { padding: '7px 14px', backgroundColor: '#fff', color: '#64748b', borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1', borderRadius: '8px', fontWeight: '500', fontSize: '13px', cursor: 'pointer' },
  
//   heroBannerCardStyle: { display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '30px', borderRadius: '18px', width: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' },
//   badgeWrapperStyle: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', marginBottom: '4px' },
//   bannerGlowEffect: { position: 'absolute', top: '-50%', right: '-20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%)', zIndex: 1 },
  
//   coverContainerStyle: { width: '120px', height: '170px', margin: '0 auto 14px', borderRadius: '8px', overflow: 'hidden', position: 'relative', backgroundColor: '#f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
//   coverImageStyle: { width: '100%', height: '100%', objectFit: 'cover' },
//   coverPlaceholderStyle: { width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', boxSizing: 'border-box', gap: '8px', textAlign: 'center' },
//   placeholderTextStyle: { fontSize: '11px', fontWeight: '600', color: '#1e293b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Star, LogOut, Library, Menu, X, Download, 
  History, Sun, Moon, UploadCloud, Eye, Trash2, ArrowLeft, Clock, CheckCircle, XCircle, Search, FileText, Image
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Core Lifecycle States
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Feature Storage Engines
  const [favorites, setFavorites] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [historyTrack, setHistoryTrack] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);

  // Self-Publish Form States (With Upload Files)
  const [publishTitle, setPublishTitle] = useState('');
  const [publishAuthor, setPublishAuthor] = useState('');
  const [publishCategory, setPublishCategory] = useState('Textbooks');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Curated Categories Matrix
  const categoriesList = [
    { name: 'Textbooks', image: 'https://thumbs.dreamstime.com/b/education-school-university-books-college-classes-16441446.jpg', color: '#eff6ff' },
    { name: 'Fiction', image: 'https://fivebooks.com/images/brjfwPAq69-IDEX2/plain/fb/2022/11/fiction-books-category-share-image.jpg', color: '#fdf2f8' },
    { name: 'Novels', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=60', color: '#f0fdf4' },
    { name: 'Story Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=60', color: '#fffbeb' },
    { name: 'Computers & Tech', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
    { name: 'History', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&auto=format&fit=crop&q=60', color: '#fdf6f7' },
    { name: 'Science', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' },
    { name: 'Poetry', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=60', color: '#fff1f2' },
    { name: 'Psychology', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop&q=60', color: '#fff1f2' },
    { name: 'Engineering', image: 'https://darnelltechnical.com/wp-content/uploads/2020/12/WhatDoesAnEngineeringDesignerDo-scaled-e1608840423998.jpg', color: '#ecfeff' },
    { name: 'Biography', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60', color: '#fef2f2' },
    { name: 'Business & Finance', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60', color: '#f0fdf4' },
    { name: 'Photography', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' },
    { name: 'Travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=60', color: '#eff6ff' },
    { name: 'Cooking & Wine', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=60', color: '#fffbeb' },
    { name: 'Games', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
    { name: 'Art', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&auto=format&fit=crop&q=60', color: '#fdf2f8' },
    { name: 'Drama', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop&q=60', color: '#f5f3ff' },
    { name: 'Law', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60', color: '#f1f5f9' },
    { name: 'Spirituality', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60', color: '#f0fdfa' }
  ];

  const fetchLibraryData = async () => {
  try {
    // Fetch ONLY published books for the catalog
    const bookRes = await fetch('http://localhost:5000/api/books');
    const bookData = await bookRes.json();
    setBooks(bookData); 

    // Fetch ONLY the user's personal submissions for the tracker
    const subRes = await fetch('http://localhost:5000/api/books/submissions/my-uploads');
    const subData = await subRes.json();
    setUserSubmissions(subData); // Keep this separate!
  } catch (err) { 
    console.error("Pipeline syncing error:", err); 
  }
};

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowMobileMenu(false);
    };
    window.addEventListener('resize', handleResize);

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      navigate('/user-login');
      return;
    }
    setUserName(name || 'Reader');

    setFavorites(JSON.parse(localStorage.getItem('booknest_favs')) || []);
    setDownloads(JSON.parse(localStorage.getItem('booknest_dls')) || []);
    setHistoryTrack(JSON.parse(localStorage.getItem('booknest_history')) || []);

    fetchLibraryData();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleReadBook = (book) => {
    const fileRelativePath = book.pdfUrl;
    if (!fileRelativePath) {
      alert("No PDF file has been uploaded for this book resource yet.");
      return;
    }
    const fileUrl = `http://localhost:5000${fileRelativePath}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');

    const updatedHistory = [book, ...historyTrack.filter(h => h._id !== book._id)];
    setHistoryTrack(updatedHistory);
    localStorage.setItem('booknest_history', JSON.stringify(updatedHistory));
  };

  const handleDownloadBook = (book) => {
    const fileRelativePath = book.pdfUrl;
    if (!fileRelativePath) {
      alert("No downloadable file attached to this resource.");
      return;
    }

    if (!downloads.some(d => d._id === book._id)) {
      const updated = [...downloads, book];
      setDownloads(updated);
      localStorage.setItem('booknest_dls', JSON.stringify(updated));
    }

    const filename = fileRelativePath.split('/').pop();
    fetch(`http://localhost:5000/uploads/${filename}`)
      .then(response => {
        if (!response.ok) throw new Error("File missing");
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const hiddenAnchor = document.createElement('a');
        hiddenAnchor.href = blobUrl;
        hiddenAnchor.download = `${book.title}.pdf`;
        document.body.appendChild(hiddenAnchor);
        hiddenAnchor.click();
        document.body.removeChild(hiddenAnchor);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
      });
  };

  const handleToggleFavorite = (book) => {
    let updated;
    if (favorites.some(f => f._id === book._id)) {
      updated = favorites.filter(f => f._id !== book._id);
    } else {
      updated = [...favorites, book];
    }
    setFavorites(updated);
    localStorage.setItem('booknest_favs', JSON.stringify(updated));
  };

  const handleRemoveDownload = (bookId) => {
    const updated = downloads.filter(d => d._id !== bookId);
    setDownloads(updated);
    localStorage.setItem('booknest_dls', JSON.stringify(updated));
  };

  const handleWipeHistory = () => {
    if (window.confirm("Are you sure you want to completely clear your reading history?")) {
      setHistoryTrack([]);
      localStorage.removeItem('booknest_history');
    }
  };

  const handleUserPublishSubmit = async (e) => {
    e.preventDefault();
    if (!publishTitle || !publishAuthor) return;
    if (!pdfFile) {
      alert("Please upload the PDF file document.");
      return;
    }
    

    // Creating multi-part form package to stream physical binary assets cleanly
    const formData = new FormData();
    formData.append("title", publishTitle);
    formData.append("author", publishAuthor);
    formData.append("category", publishCategory);
    formData.append("pdf", pdfFile);
    if (coverFile) {
      formData.append("cover", coverFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/books/submissions/create', {
        method: 'POST',
        body: formData // Sends binary package automatically with matching boundary headers
      });
      
      if (response.ok) {
        alert("Your book publication package has been securely uploaded for admin review!");
        setPublishTitle('');
        setPublishAuthor('');
        setPdfFile(null);
        setCoverFile(null);
        // Clear files from the input elements physically
        document.getElementById('pdfInput').value = '';
        const covIn = document.getElementById('coverInput');
        if (covIn) covIn.value = '';
        
        fetchLibraryData();
      } else {
        const errData = await response.json();
        alert(`Upload rejected: ${errData.message}`);
      }
    } catch (err) { 
      alert("Error reaching submission server node pipeline.");
    }
  };
const handleDeleteSubmission = async (id) => {
    const confirmDelete = window.confirm("Delete this submission permanently?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/submissions/${id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setUserSubmissions(prev =>
          prev.filter(item => item._id !== id)
        );
      } else {
        alert("Failed to delete submission");
      }
    } catch (err) {
      alert("Server error while deleting submission");
    }
  };
  // Styling Rules Matrix
  const sidebarWidth = '260px';
  const themeBg = isDarkMode ? '#0f172a' : '#f8fafc';
  const themeCard = isDarkMode ? '#1e293b' : '#ffffff';
  const themeBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const themeText = isDarkMode ? '#f8fafc' : '#0f172a';
  const themeSubtext = isDarkMode ? '#94a3b8' : '#64748b';

  const styles = {
    dashboardBody: { display: 'flex', minHeight: '100vh', backgroundColor: themeBg, color: themeText, fontFamily: "'Inter', sans-serif", overflowX: 'hidden', position: 'relative' },
    sidebar: { width: sidebarWidth, backgroundColor: '#0f172a', padding: '32px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: isMobile ? (showMobileMenu ? '0' : '-100%') : '0', zIndex: 2000, transition: 'left 0.4s ease', color: '#f8fafc' },
    mainContent: { flex: 1, marginLeft: isMobile ? '0' : sidebarWidth, width: '100%', padding: isMobile ? '90px 20px 40px' : '40px 60px', boxSizing: 'border-box' },
    mobileHeader: { position: 'absolute', top: '20px', left: '20px', display: isMobile ? 'block' : 'none', zIndex: 100, cursor: 'pointer', color: themeText },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1500, opacity: showMobileMenu ? 1 : 0, visibility: showMobileMenu ? 'visible' : 'hidden' },
    responsiveGrid: { display: 'grid', gap: '24px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))' },
    customCard: { backgroundColor: themeCard, padding: '20px', borderRadius: '16px', border: `1px solid ${themeBorder}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' },
    searchFormStyle: { marginBottom: '30px', width: '100%', maxWidth: '600px' },
    inputWrapperStyle: { display: 'flex', alignItems: 'center', backgroundColor: themeCard, border: `1px solid ${themeBorder}`, borderRadius: '10px', padding: '4px 12px' },
    fileInputContainer: { display: 'flex', flexDirection: 'column', gap: '6px', border: `1px dashed ${themeBorder}`, padding: '12px', borderRadius: '8px', backgroundColor: themeBg }
  };

  const renderStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'published':
      case 'approved':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}><CheckCircle size={14} /> Published</span>;
      case 'rejected':
        return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}><XCircle size={14} /> Rejected</span>;
      default:
        return <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}><Clock size={14} /> Pending Review</span>;
    }
  };

  const renderActiveTabContent = () => {
  const filteredBooks = books.filter(b => {

  // Show both admin published books and approved user books
  const isPublic =
    b.status === 'published' ||
    b.status === 'approved';

  const matchesCategory = selectedCategory
    ? b.category === selectedCategory
    : true;

  const matchesSearch =
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase());

  return isPublic && matchesCategory && matchesSearch;
});
    switch (activeTab) {
      case 'home':
      case 'catalog':
        if (activeTab === 'catalog' && !selectedCategory) {
          return (
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Curated Library Catalogs</h2>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
                {categoriesList.map(cat => (
                  <div key={cat.name} onClick={() => { setSelectedCategory(cat.name); setActiveTab('home'); }} style={{ backgroundColor: themeCard, border: `1px solid ${themeBorder}`, borderRadius: '16px', padding: '12px', cursor: 'pointer', textAlign: 'center' }}>
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }} />
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{cat.name}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} /></button>
                )}
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{selectedCategory ? `${selectedCategory} Collection` : 'Available Collection'}</h2>
                <span style={{ background: themeBorder, padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{filteredBooks.length} Books</span>
              </div>
            </div>

            <div style={styles.responsiveGrid}>
              {filteredBooks.length > 0 ? filteredBooks.map(book => {
                const isFav = favorites.some(f => f._id === book._id);
                // Dynamically fetch absolute paths if assets are loaded from backend uploads directly
                const finalCoverUrl = book.coverUrl 
                  ? (book.coverUrl.startsWith('http') ? book.coverUrl : `http://localhost:5000${book.coverUrl}`)
                  : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=60';
                  
                return (
                  <div key={book._id} style={styles.customCard}>
                    <div>
                      <img src={finalCoverUrl} alt={book.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
                      <button onClick={() => handleToggleFavorite(book)} style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(15,23,42,0.6)', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                        <Star size={16} color={isFav ? '#eab308' : '#fff'} fill={isFav ? '#eab308' : 'none'} />
                      </button>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '700' }}>{book.title}</h3>
                      <p style={{ color: themeSubtext, fontSize: '13px', marginBottom: '15px' }}>{book.author}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button onClick={() => handleReadBook(book)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}><Eye size={14} /> View</button>
                      <button onClick={() => handleDownloadBook(book)} style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}><Download size={14} /> Save</button>
                    </div>
                  </div>
                );
              }) : (
                <div style={emptyStyle}>
                  <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} />
                  <p style={{ margin: 0, fontWeight: '600' }}>No matching library records found.</p>
                </div>
              )}
            </div>
          </section>
        );

      case 'favorites':
        return (
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Starred Resources</h2>
            <div style={styles.responsiveGrid}>
              {favorites.length > 0 ? favorites.map(book => (
                <div key={book._id} style={styles.customCard}>
                  <img src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=60'} alt={book.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{book.title}</h3>
                  <p style={{ color: themeSubtext, fontSize: '13px' }}>{book.author}</p>
                  <button onClick={() => handleReadBook(book)} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Read Resource</button>
                </div>
              )) : (
                <div style={emptyStyle}><Star size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} /><p style={{ margin: 0 }}>No starred entries recorded.</p></div>
              )}
            </div>
          </section>
        );

      case 'downloads':
        return (
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Offline Downloads Hub</h2>
            <div style={styles.responsiveGrid}>
              {downloads.length > 0 ? downloads.map(book => (
                <div key={book._id} style={styles.customCard}>
                  <img src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=60'} alt={book.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} />
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}>{book.title}</h3>
                  <p style={{ color: themeSubtext, fontSize: '13px', textAlign: 'center' }}>{book.author}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => handleReadBook(book)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Read Offline</button>
                    <button onClick={() => handleRemoveDownload(book._id)} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              )) : (
                <div style={emptyStyle}><Download size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} /><p style={{ margin: 0 }}>Download directory is empty.</p></div>
              )}
            </div>
          </section>
        );

      case 'history':
        return (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>History Log</h2>
              {historyTrack.length > 0 && (
                <button onClick={handleWipeHistory} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', background: 'none', cursor: 'pointer', fontWeight: '600' }}><Trash2 size={14} /> Clear Log</button>
              )}
            </div>
            <div style={styles.responsiveGrid}>
              {historyTrack.length > 0 ? historyTrack.map((book, idx) => (
                <div key={book._id + '-' + idx} style={styles.customCard}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{book.title}</h3>
                  <p style={{ color: themeSubtext, fontSize: '13px', margin: 0 }}>{book.author}</p>
                  <button onClick={() => handleReadBook(book)} style={{ width: '100%', padding: '10px', marginTop: '15px', borderRadius: '8px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', cursor: 'pointer', fontWeight: '600' }}>Reopen Asset</button>
                </div>
              )) : (
                <div style={emptyStyle}><History size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} /><p style={{ margin: 0 }}>No dynamic reading timeline logs found.</p></div>
              )}
            </div>
          </section>
        );

      case 'publish':
        return (
          <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            {/* Left Column: Input Creation Box Form */}
            <div style={{ backgroundColor: themeCard, padding: '30px', borderRadius: '24px', border: `1px solid ${themeBorder}` }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', marginTop: 0 }}>Publish Book Asset</h2>
              <p style={{ color: themeSubtext, fontSize: '13px', marginBottom: '20px' }}>Submit your book to the administrator review board.</p>
              
              <form onSubmit={handleUserPublishSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Book Title *</label>
                  <input type="text" required value={publishTitle} onChange={e => setPublishTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${themeBorder}`, backgroundColor: themeBg, color: themeText, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Author Name *</label>
                  <input type="text" required value={publishAuthor} onChange={e => setPublishAuthor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${themeBorder}`, backgroundColor: themeBg, color: themeText, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category *</label>
                  <select value={publishCategory} onChange={e => setPublishCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${themeBorder}`, backgroundColor: themeBg, color: themeText, boxSizing: 'border-box' }}>
                    {categoriesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                {/* NEW OPTION: Document file attachment layer */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Upload PDF Document *</label>
                  <div style={styles.fileInputContainer}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: themeSubtext, fontSize: '12px', marginBottom: '4px' }}>
                      <FileText size={16} color="#6366f1" />
                      <span>{pdfFile ? pdfFile.name : "Select book PDF file (Max 15MB)"}</span>
                    </div>
                    <input id="pdfInput" type="file" required accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ fontSize: '13px', color: themeSubtext }} />
                  </div>
                </div>

                {/* NEW OPTION: Graphic asset attachment layer */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Upload Cover Page Image (Optional)</label>
                  <div style={styles.fileInputContainer}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: themeSubtext, fontSize: '12px', marginBottom: '4px' }}>
                      <Image size={16} color="#6366f1" />
                      <span>{coverFile ? coverFile.name : "Select cover artwork (PNG/JPG)"}</span>
                    </div>
                    <input id="coverInput" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={{ fontSize: '13px', color: themeSubtext }} />
                  </div>
                </div>

                <button type="submit" style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}><UploadCloud size={16} /> Dispatch For Review</button>
              </form>
            </div>

            {/* Right Column: Live Status Tracker Monitoring Feed */}
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', marginTop: 0 }}>Track Submissions</h2>
              <p style={{ color: themeSubtext, fontSize: '13px', marginBottom: '20px' }}>Real-time updates directly from the admin validation desk.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {userSubmissions.length > 0 ? userSubmissions.map(sub => (
                  <div key={sub._id} style={{ backgroundColor: themeCard, padding: '20px', borderRadius: '16px', border: `1px solid ${themeBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700' }}>{sub.title}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: themeSubtext }}>By {sub.author} • <span style={{ fontStyle: 'italic' }}>{sub.category}</span></p>
                      </div>
                      {renderStatusBadge(sub.status)}
                      <button
  onClick={() => handleDeleteSubmission(sub._id)}
  style={{
    marginTop: '10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  }}
>
  <Trash2 size={14} />
  Delete
</button>
                    </div>
                    
                    {sub.status?.toLowerCase() === 'rejected' && sub.rejectionReason && (
                      <div style={{ backgroundColor: 'rgba(239,68,68,0.06)', borderLeft: '4px solid #ef4444', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginTop: '4px' }}>
                        <strong style={{ color: '#ef4444', display: 'block', marginBottom: '2px' }}>Reason for Rejection:</strong>
                        <span style={{ color: themeText }}>{sub.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={{ padding: '40px 20px', border: `2px dashed ${themeBorder}`, borderRadius: '16px', textAlign: 'center', color: themeSubtext }}>
                    <Clock size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No publications sent out yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };


  return (
    <div style={styles.dashboardBody}>
      <div style={styles.mobileHeader} onClick={() => setShowMobileMenu(true)}>
        <Menu size={26} strokeWidth={2.2} />
      </div>

      <div style={styles.overlay} onClick={() => setShowMobileMenu(false)} />

      <aside style={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Library size={26} color="#6366f1" strokeWidth={2.2} />
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, letterSpacing: '-0.3px' }}>NoteNest</h2>
          </div>
          {isMobile && <X onClick={() => setShowMobileMenu(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />}
        </div>
        
        <nav style={{ flex: 1 }}>
          <div style={activeTab === 'home' && !selectedCategory ? activeNavItem : navItem} onClick={() => { setActiveTab('home'); setSelectedCategory(null); setShowMobileMenu(false); }}><Home size={20} style={iconStyle} /> Home</div>
          <div style={activeTab === 'catalog' || selectedCategory ? activeNavItem : navItem} onClick={() => { setActiveTab('catalog'); setSelectedCategory(null); setShowMobileMenu(false); }}><BookOpen size={20} style={iconStyle} /> Catalog</div>
          <div style={activeTab === 'favorites' ? activeNavItem : navItem} onClick={() => { setActiveTab('favorites'); setSelectedCategory(null); setShowMobileMenu(false); }}><Star size={20} style={iconStyle} /> Favorites</div>
          <div style={activeTab === 'downloads' ? activeNavItem : navItem} onClick={() => { setActiveTab('downloads'); setSelectedCategory(null); setShowMobileMenu(false); }}><Download size={20} style={iconStyle} /> Downloads</div>
          <div style={activeTab === 'history' ? activeNavItem : navItem} onClick={() => { setActiveTab('history'); setSelectedCategory(null); setShowMobileMenu(false); }}><History size={20} style={iconStyle} /> History Track</div>
          <div style={activeTab === 'publish' ? activeNavItem : navItem} onClick={() => { setActiveTab('publish'); setSelectedCategory(null); setShowMobileMenu(false); }}><UploadCloud size={20} style={iconStyle} /> Self-Publish</div>
        </nav>

        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...logoutBtn, marginBottom: '10px', background: 'none', border: `1px solid ${themeBorder}`, color: themeText }}>
          {isDarkMode ? <Sun size={18} style={iconStyle} color="#f59e0b" /> : <Moon size={18} style={iconStyle} color="#38bdf8" />}
          {isDarkMode ? 'Light Display' : 'Dark Display'}
        </button>

        <button onClick={() => { localStorage.clear(); navigate('/user-login'); }} style={logoutBtn}>
          <LogOut size={16} style={iconStyle} /> Logout
        </button>
      </aside>

      <main style={styles.mainContent}>
        <header style={{ marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
              Happy Reading, {userName.charAt(0).toUpperCase() + userName.slice(1)}!
            </h1>
            <p style={{ color: themeSubtext, marginTop: '4px', fontSize: '14px' }}>Access your digital library resources.</p>
          </div>
        </header>

        {(activeTab === 'home' || activeTab === 'catalog') && (
          <form onSubmit={e => e.preventDefault()} style={styles.searchFormStyle}>
            <div style={styles.inputWrapperStyle}>
              <Search size={16} color="#94a3b8" style={{ marginLeft: '14px' }} />
              <input 
                type="text" 
                placeholder="Search resources by title or author name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px', border: 'none', background: 'none', color: themeText, outline: 'none', fontSize: '14px' }} 
              />
            </div>
          </form>
        )}

        {renderActiveTabContent()}
      </main>
    </div>
  );
};

const navItem = { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#94a3b8', cursor: 'pointer', marginBottom: '8px', fontSize: '14px', fontWeight: '500', borderRadius: '8px' };
const activeNavItem = { ...navItem, backgroundColor: '#1e293b', color: '#fff', borderLeft: '4px solid #6366f1', fontWeight: '600' };
const iconStyle = { marginRight: '12px', flexShrink: 0 };
const logoutBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', background: 'none', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '14px', fontWeight: '600' };
const emptyStyle = { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', border: '2px dashed #cbd5e1', borderRadius: '24px', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box' };

export default Dashboard;