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
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
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
