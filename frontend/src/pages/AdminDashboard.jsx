// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { PlusCircle, BookOpen, LogOut, Library, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [pdfFile, setPdfFile] = useState(null);
//   const [books, setBooks] = useState([]);
//   const [status, setStatus] = useState({ type: '', msg: '' });
//   const [isUploading, setIsUploading] = useState(false);

//   // Fetch current books to show "Management" view
//   const fetchBooks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/books');
//       const data = await response.json();
//       setBooks(data);
//     } catch (err) { console.error("Fetch error:", err); }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type !== 'application/pdf') {
//       setStatus({ type: 'error', msg: 'Only PDF files are allowed!' });
//       setPdfFile(null);
//       return;
//     }
//     setPdfFile(file);
//     setStatus({ type: '', msg: '' });
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!pdfFile) return setStatus({ type: 'error', msg: 'Please select a PDF file.' });

//     setIsUploading(true);
//     setStatus({ type: 'info', msg: 'Uploading to NoteNest...' });

//     // CRITICAL: Packaging for your Multer backend
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('author', author);
//     formData.append('pdf', pdfFile); // Matches your backend upload.single("pdf")

//     try {
//       const response = await fetch('http://localhost:5000/api/books/add', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setStatus({ type: 'success', msg: 'Book successfully added to library!' });
//         setTitle(''); setAuthor(''); setPdfFile(null);
//         e.target.reset(); // Clear the file input
//         fetchBooks(); // Refresh the list
//       } else {
//         setStatus({ type: 'error', msg: data.message || 'Upload failed' });
//       }
//     } catch (err) {
//       setStatus({ type: 'error', msg: 'Server connection failed.' });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // 👇 ADDED: Handle book deletion pipeline 👇
//   const handleDeleteBook = async (bookId) => {
//     if (!window.confirm("Are you sure you want to remove this book from NoteNest completely?")) return;

//     try {
//       const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         setStatus({ type: 'success', msg: 'Book removed from system successfully.' });
//         fetchBooks(); // Refresh UI list instantly
//       } else {
//         setStatus({ type: 'error', msg: 'Failed to delete the book record.' });
//       }
//     } catch (err) {
//       console.error("Deletion link error:", err);
//       setStatus({ type: 'error', msg: 'Server connection error during deletion.' });
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <aside style={styles.sidebar}>
//         <div style={styles.logoBox}>
//           <Library size={32} color="#6366f1" strokeWidth={2.5} />
//           <h2 style={styles.logoText}>NoteNest Admin</h2>
//         </div>
//         <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>
//           <LogOut size={18} /> Logout
//         </button>
//       </aside>

//       <main style={styles.main}>
//         <header style={styles.header}>
//           <h1 style={styles.title}>Library Management</h1>
//           <p style={styles.subtitle}>Upload and monitor your digital collection.</p>
//         </header>

//         <div style={styles.contentGrid}>
//           {/* LEFT: Upload Form */}
//           <section style={styles.card}>
//             <h2 style={styles.cardTitle}><PlusCircle size={20} /> Add New Resource</h2>
//             {status.msg && (
//               <div style={{...styles.alert, backgroundColor: status.type === 'error' ? '#fee2e2' : '#e0e7ff'}}>
//                 {status.type === 'error' ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle size={18} color="#6366f1" />}
//                 <span style={{color: status.type === 'error' ? '#b91c1c' : '#3730a3'}}>{status.msg}</span>
//               </div>
//             )}
//             <form onSubmit={handleUpload} style={styles.form}>
//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>Book Title</label>
//                 <input style={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Advanced Calculus" />
//               </div>
//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>Author Name</label>
//                 <input style={styles.input} type="text" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="e.g. Dr. Jane Smith" />
//               </div>
//               <div style={styles.inputGroup}>
//                 <label style={styles.label}>PDF File</label>
//                 <input style={styles.fileInput} type="file" accept=".pdf" onChange={handleFileChange} required />
//               </div>
//               <button style={styles.btn} disabled={isUploading}>
//                 {isUploading ? 'Processing...' : 'Upload to Collection'}
//               </button>
//             </form>
//           </section>

//           {/* RIGHT: Live Stats & Removals */}
//           <section style={styles.statsCard}>
//             <h2 style={styles.cardTitle}><BookOpen size={20} /> Current Inventory</h2>
//             <div style={styles.bigNumber}>{books.length}</div>
//             <p style={styles.statsLabel}>Total Resources in Cloud</p>
//             <div style={styles.bookList}>
//               {books.slice(-5).reverse().map(b => (
//                 <div key={b._id} style={styles.listItem}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
//                     <FileText size={16} color="#6366f1" style={{ flexShrink: 0 }} />
//                     <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{b.title}</span>
//                   </div>
//                   {/* 👇 ADDED: Delete Button triggering backend route 👇 */}
//                   <button 
//                     onClick={() => handleDeleteBook(b._id)} 
//                     style={styles.deleteMiniBtn}
//                     title="Delete book from system"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// const styles = {
//   container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" },
//   sidebar: { width: '280px', backgroundColor: '#0f172a', color: '#fff', padding: '40px 20px', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', boxSizing: 'border-box' },
//   logoBox: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
//   logoText: { fontSize: '22px', fontWeight: '800', margin: 0 },
//   logoutBtn: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer' },
//   main: { flex: 1, marginLeft: '280px', padding: '50px 60px' },
//   header: { marginBottom: '40px' },
//   title: { fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: 0 },
//   subtitle: { color: '#64748b', marginTop: '5px' },
//   contentGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' },
//   card: { backgroundColor: '#fff', padding: '35px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
//   cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' },
//   form: { display: 'flex', flexDirection: 'column', gap: '20px' },
//   inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
//   label: { fontSize: '14px', fontWeight: '600', color: '#475569' },
//   input: { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', transition: '0.2s' },
//   fileInput: { padding: '10px', border: '2px dashed #e2e8f0', borderRadius: '10px', cursor: 'pointer' },
//   btn: { backgroundColor: '#6366f1', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', transition: '0.2s' },
//   alert: { padding: '15px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' },
//   statsCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' },
//   bigNumber: { fontSize: '64px', fontWeight: '800', color: '#6366f1' },
//   statsLabel: { color: '#64748b', fontSize: '14px', marginBottom: '30px' },
//   bookList: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' },
//   listItem: { display: 'flex', alignItems: 'center', justify: 'space-between', gap: '10px', fontSize: '13px', color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' },
//   // Styled mini delete controller button
//   deleteMiniBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px', transition: 'color 0.2s, background-color 0.2s', ':hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, BookOpen, LogOut, Library, FileText, CheckCircle, 
  AlertCircle, Trash2, ShieldAlert, Check, X, Menu 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Textbooks');
  const [coverUrl, setCoverUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [books, setBooks] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isUploading, setIsUploading] = useState(false);
  
  // Responsive Media View Engine
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Complete Curated Core Catalogs
  const categoriesList = [
    'Textbooks', 'Fiction', 'Novels', 'Story Books', 'Computers & Tech',
    'History', 'Science', 'Poetry', 'Psychology', 'Engineering',
    'Biography', 'Business & Finance', 'Photography', 'Travel',
    'Cooking & Wine', 'Games', 'Art', 'Drama', 'Law', 'Spirituality'
  ];

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (err) { console.error("Fetch inventory error:", err); }
  };

  const fetchUserSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/submissions');
      if (response.ok) {
        const data = await response.json();
        setUserSubmissions(data);
      } else {
        // Fallback local mirror sync
        const localSaved = JSON.parse(localStorage.getItem('pending_user_submissions')) || [];
        setUserSubmissions(localSaved);
      }
    } catch (err) { 
      const localSaved = JSON.parse(localStorage.getItem('pending_user_submissions')) || [];
      setUserSubmissions(localSaved);
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(response.data);
    } catch (_err) {
      setError('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUserSubmissions();

    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setShowMobileMenu(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setStatus({ type: 'error', msg: 'Only structural PDF documents are allowed!' });
      setPdfFile(null);
      return;
    }
    setPdfFile(file);
    setStatus({ type: '', msg: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) return setStatus({ type: 'error', msg: 'Please select a valid PDF file.' });

    setIsUploading(true);
    setStatus({ type: 'info', msg: 'Uploading configuration payload...' });
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('coverUrl', coverUrl);
    formData.append('pdf', pdfFile);

    try {
      const response = await fetch('http://localhost:5000/api/books/add', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Book successfully added to core catalog index!' });
        setTitle(''); setAuthor(''); setCoverUrl(''); setPdfFile(null);
        e.target.reset();
        fetchBooks();
      } else {
        setStatus({ type: 'error', msg: data.message || 'Upload failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server connectivity dropped. Layout configuration updated.' });
    } finally {
      setIsUploading(false);
    }
  };
const handleReviewSubmission = async (id, isAccepted, extraData = {}) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/books/submissions/review/${id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accepted: isAccepted,
          ...extraData
        })
      }
    );

    if (response.ok) {
      setUserSubmissions(prev =>
        prev.filter(item => item._id !== id)
      );

      setStatus({
        type: 'success',
        msg: isAccepted
          ? 'Submission accepted!'
          : 'Submission rejected!'
      });

      if (isAccepted) fetchBooks();
    } else {
      setStatus({ type: 'error', msg: 'Failed to review submission' });
    }
  } catch (err) {
    setStatus({ type: 'error', msg: 'Server error during review' });
  }
};
const handleDeleteBook = async (id) => {
  const confirmDelete = window.confirm("Delete this book permanently?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/books/${id}`,
      { method: 'DELETE' }
    );

    if (response.ok) {
      setBooks(prev => prev.filter(b => b._id !== id));
      setStatus({ type: 'success', msg: 'Book deleted successfully' });
    } else {
      setStatus({ type: 'error', msg: 'Failed to delete book' });
    }
  } catch (err) {
    setStatus({ type: 'error', msg: 'Server error during delete' });
  }
};
  const handleDeleteSubmission = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this submission?");
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
      alert("Failed to delete submission.");
    }
  } catch (err) {
    alert("Server error while deleting.");
  }
};
  const sidebarWidth = '280px';
  const responsiveStyles = {
    sidebar: {
      width: sidebarWidth,
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      boxSizing: 'border-box',
      left: isMobile ? (showMobileMenu ? '0' : '-100%') : '0',
      transition: 'left 0.3s ease-in-out',
      zIndex: 3000
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? '0' : sidebarWidth,
      padding: isMobile ? '90px 20px 40px' : '50px 60px',
      boxSizing: 'border-box'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
      gap: '30px'
    formData.append('pdf', pdfFile);

    try {
      await axios.post(`${API_BASE_URL}/api/books/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Book uploaded successfully.');
      setTitle('');
      setAuthor('');
      setPdfFile(null);
      event.target.reset();
      fetchBooks();
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const getBookId = (book) => book._id || book.id || book.bookId;

  const startEdit = (book) => {
    setEditingBookId(getBookId(book));
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingBookId(null);
    setEditTitle('');
    setEditAuthor('');
  };

  const handleUpdate = async (bookId) => {
    setMessage('');
    setError('');
    try {
      await axios.put(`${API_BASE_URL}/api/books/update/${bookId}`, {
        title: editTitle,
        author: editAuthor,
      });
      setMessage('Book updated successfully.');
      cancelEdit();
      fetchBooks();
    } catch (updateError) {
      setError(updateError?.response?.data?.message || 'Update failed.');
    }
  };

  const handleDelete = async (bookId) => {
    setError('');
    setMessage('');
    try {
      await axios.delete(`${API_BASE_URL}/api/books/delete/${bookId}`);
      setMessage('Book deleted successfully.');
      fetchBooks();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Mobile Top Bar Navigation Drawer Toggle */}
      {isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 2000, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Library size={24} color="#6366f1" />
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px' }}>NoteNest Admin</span>
          </div>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
            {showMobileMenu ? <X size={20} color="#0f172a" /> : <Menu size={20} color="#0f172a" />}
          </button>
        </div>
      )}

      {showMobileMenu && <div onClick={() => setShowMobileMenu(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 2500 }} />}

      <aside style={responsiveStyles.sidebar}>
        <div style={styles.logoBox}>
          <Library size={32} color="#6366f1" strokeWidth={2.5} />
          <h2 style={styles.logoText}>NoteNest Admin</h2>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main style={responsiveStyles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Library Management</h1>
          <p style={styles.subtitle}>Upload resource collections and monitor user submissions.</p>
        </header>

        <div style={responsiveStyles.contentGrid}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Upload Area Component */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}><PlusCircle size={20} color="#6366f1" /> Add New Resource</h2>
              {status.msg && (
                <div style={{ ...styles.alert, backgroundColor: status.type === 'error' ? '#fee2e2' : '#e0e7ff' }}>
                  {status.type === 'error' ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle size={18} color="#6366f1" />}
                  <span style={{ color: status.type === 'error' ? '#b91c1c' : '#3730a3' }}>{status.msg}</span>
                </div>
              )}
              
              <form onSubmit={handleUpload} style={styles.form}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Book Title *</label>
                    <input style={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Advanced Calculus" />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Author Name *</label>
                    <input style={styles.input} type="text" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="e.g. Dr. Jane Smith" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Catalog Placement *</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
                      {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Cover Page Image Link (URL)</label>
                    <input style={styles.input} type="url" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://example.com/cover.jpg" />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>PDF File *</label>
                  <input style={styles.fileInput} type="file" accept=".pdf" onChange={handleFileChange} required />
                </div>
                
                <button style={styles.btn} disabled={isUploading}>
                  {isUploading ? 'Uploading Configuration Payload...' : 'Upload to Collection'}
                </button>
              </form>
            </section>

            {/* User Submission Auditing Board */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}><ShieldAlert size={20} color="#f59e0b" /> User Published Submissions ({userSubmissions.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                {userSubmissions.length > 0 ? userSubmissions.map((sub) => (
                  <div key={sub._id} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ color: '#1e293b' }}>{sub.title}</strong>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e7ff', color: '#6366f1' }}>{sub.category}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>By: {sub.author}</div>
                      
                      
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto', justifyContent: 'flex-end' }}>
                    <button
  onClick={() => {
    window.open(`http://localhost:5000${sub.pdfUrl}`, '_blank');
  }}
  style={{
    flex: isMobile ? 1 : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  }}
>
  <FileText size={14} /> View PDF
</button>
                      <button 
                        onClick={() => handleReviewSubmission(sub._id, true, sub)}
                     disabled={false}
                        style={{ flex: isMobile ? 1 : 'none', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button 
  onClick={() => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    handleReviewSubmission(sub._id, false, {
      rejectionReason: reason
    });
  }}
  style={{ 
    flex: isMobile ? 1 : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  }}
>
  <X size={14} /> Reject
</button>
                    </div>
                  </div>
                )) : (
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>No incoming user publications currently awaiting review.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Inventory Overview Module */}
          <section style={styles.statsCard}>
            <h2 style={styles.cardTitle}><BookOpen size={20} color="#6366f1" /> Inventory Hub</h2>
            <div style={styles.bigNumber}>{books.length}</div>
            <p style={styles.statsLabel}>Total Live Resources</p>
            
            <div style={styles.bookList}>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', margin: '0 0 10px 0', fontWeight: '700' }}>Recent Updates</h3>
              {books.slice(-5).reverse().map(b => (
                <div key={b._id} style={styles.listItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
                    <FileText size={16} color="#6366f1" style={{ flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '600' }}>{b.title}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{b.category || 'Textbooks'}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteBook(b._id)} style={styles.deleteMiniBtn} title="Delete asset">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    <div style={containerStyle}>
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleUpload} style={formStyle}>
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="file"
          aria-label="PDF file"
          accept="application/pdf,.pdf"
          onChange={(e) => setPdfFile(e.target.files[0] || null)}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload PDF'}
        </button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <h2>Uploaded Books</h2>
      {loading ? (
        <p>Loading books…</p>
      ) : books.length === 0 ? (
        <p>No books available yet.</p>
      ) : (
        <div style={bookListStyle}>
          {books.map((book) => {
            const bookId = getBookId(book);
            const pdfUrl = book.pdfUrl?.startsWith('http') ? book.pdfUrl : `${API_BASE_URL}${book.pdfUrl}`;
            const isEditing = editingBookId === bookId;

            return (
              <div key={bookId} style={bookCardStyle}>
                {isEditing ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={editInputStyle}
                    />
                    <input
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      style={editInputStyle}
                    />
                    <div style={actionRow}>
                      <button type="button" onClick={() => handleUpdate(bookId)} style={secondaryBtn}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit} style={cancelBtn}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={bookHeader}>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                    </div>
                    <div style={metaRow}>
                      {book.pdfUrl ? (
                        <>
                          <a href={pdfUrl} target="_blank" rel="noreferrer" style={linkStyle}>
                            Open PDF
                          </a>
                          <a href={pdfUrl} download style={linkStyle}>
                            Download PDF
                          </a>
                        </>
                      ) : (
                        <span>No PDF attached</span>
                      )}
                    </div>
                    <div style={actionRow}>
                      <button type="button" onClick={() => startEdit(book)} style={secondaryBtn}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(bookId)} style={deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  logoBox: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '50px' },
  logoText: { fontSize: '22px', fontWeight: '800', margin: 0 },
  logoutBtn: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  header: { marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px', fontSize: '15px' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  cardTitle: { fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: '#334155' },
  fileInput: { padding: '14px', border: '2px dashed #cbd5e1', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#f8fafc' },
  btn: { backgroundColor: '#6366f1', color: '#fff', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
  alert: { padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '15px' },
  statsCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', height: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  bigNumber: { fontSize: '56px', fontWeight: '800', color: '#6366f1', lineHeight: 1 },
  statsLabel: { color: '#64748b', fontSize: '13px', marginBottom: '25px', marginTop: '5px' },
  bookList: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '13px', color: '#475569', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  deleteMiniBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '6px', transition: 'all 0.2s', ':hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }
};

export default AdminDashboard;
const containerStyle = {
  maxWidth: '960px',
  margin: '20px auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '480px',
  marginBottom: '20px',
};

const editInputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
};

const bookListStyle = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
};

const bookCardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '16px',
  padding: '18px',
  background: '#fff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const bookHeader = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const metaRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
};

const actionRow = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const linkStyle = {
  color: '#1e88e5',
  textDecoration: 'none',
};

const secondaryBtn = {
  padding: '10px 18px',
  borderRadius: '12px',
  border: '1px solid #1e88e5',
  background: 'white',
  color: '#1e88e5',
  cursor: 'pointer',
};

const deleteBtn = {
  ...secondaryBtn,
  background: '#ef5350',
  color: 'white',
  border: '1px solid #ef5350',
};

const cancelBtn = {
  ...secondaryBtn,
  background: '#f5f5f5',
  color: '#333',
};

const messageStyle = {
  color: '#2e7d32',
};

const errorStyle = {
  color: '#c62828',
};

export default AdminDashboard;
