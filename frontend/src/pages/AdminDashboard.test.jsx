import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';

jest.mock('axios');

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  it('uploads a PDF using multipart form data', async () => {
    axios.post.mockResolvedValue({ data: {} });

    render(<AdminDashboard />);

    fireEvent.change(screen.getByPlaceholderText('Book title'), {
      target: { value: 'Test Book' },
    });
    fireEvent.change(screen.getByPlaceholderText('Author'), {
      target: { value: 'Test Author' },
    });

    const file = new File(['pdf-content'], 'sample.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('PDF file'), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Upload PDF' }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    const [url, formData, config] = axios.post.mock.calls[0];
    expect(url).toContain('/api/books/add');
    expect(formData.get('title')).toBe('Test Book');
    expect(formData.get('author')).toBe('Test Author');
    expect(formData.get('pdf').name).toBe('sample.pdf');
    expect(config).toMatchObject({
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });
});
