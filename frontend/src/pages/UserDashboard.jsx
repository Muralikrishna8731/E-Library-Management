import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(response.data);
    } catch (_err) {
      setError('Unable to load available books right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={headerCard}>
        <h1>Available Books</h1>
        <p>Browse the current e-library collection and open or download PDFs.</p>
      </div>
      {loading ? (
        <p style={statusText}>Loading books…</p>
      ) : error ? (
        <p style={errorStyle}>{error}</p>
      ) : books.length === 0 ? (
        <p style={statusText}>No books are available yet. Please check back soon.</p>
      ) : (
        <div style={booksGrid}>
          {books.map((book) => {
            const pdfUrl = book.pdfUrl?.startsWith('http') ? book.pdfUrl : `${API_BASE_URL}${book.pdfUrl}`;
            const bookId = book._id || book.id;
            return (
              <article key={bookId} style={bookCard}>
                <div>
                  <h2 style={titleStyle}>{book.title}</h2>
                  <p style={authorStyle}>by {book.author}</p>
                </div>
                <div style={actionRow}>
                  {book.pdfUrl ? (
                    <>
                      <a href={pdfUrl} target="_blank" rel="noreferrer" style={actionLink}>
                        View PDF
                      </a>
                      <a href={pdfUrl} download style={actionLink}>
                        Download
                      </a>
                    </>
                  ) : (
                    <span style={noPdfText}>PDF not available</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '1000px',
  margin: '24px auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const headerCard = {
  background: '#f5f7ff',
  borderRadius: '20px',
  padding: '28px 30px',
  marginBottom: '20px',
  boxShadow: '0 16px 40px rgba(37, 99, 235, 0.08)',
};

const statusText = {
  fontSize: '16px',
  color: '#555',
};

const booksGrid = {
  display: 'grid',
  gap: '18px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
};

const bookCard = {
  padding: '22px',
  borderRadius: '20px',
  background: '#ffffff',
  border: '1px solid #e8ecf3',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '16px',
};

const titleStyle = {
  margin: '0 0 8px 0',
  color: '#111827',
  fontSize: '20px',
  lineHeight: '1.3',
};

const authorStyle = {
  margin: 0,
  color: '#4b5563',
  fontSize: '14px',
};

const actionRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
};

const actionLink = {
  padding: '12px 18px',
  background: '#2563eb',
  color: 'white',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '600',
};

const noPdfText = {
  color: '#9ca3af',
  fontSize: '14px',
};

const errorStyle = {
  color: '#b91c1c',
};

export default UserDashboard;
