import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books`);
      setBooks(response.data);
    } catch (_err) {
      setError('Failed to load books.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

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
        <button type="submit">Upload PDF</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <h2>Uploaded Books</h2>
      <ul>
        {books.map((book) => {
          const pdfUrl = book.pdfUrl?.startsWith('http') ? book.pdfUrl : `${API_BASE_URL}${book.pdfUrl}`;
          return (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author}{' '}
              {book.pdfUrl ? (
                <>
                  <a href={pdfUrl} target="_blank" rel="noreferrer">
                    Open PDF
                  </a>{' '}
                  |{' '}
                  <a href={pdfUrl} download>
                    Download PDF
                  </a>
                </>
              ) : (
                'No PDF'
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const containerStyle = {
  maxWidth: '900px',
  margin: '20px auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  marginBottom: '20px',
};

const errorStyle = {
  color: '#c62828',
};

export default AdminDashboard;
