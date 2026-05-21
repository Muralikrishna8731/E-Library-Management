import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserLogin from './UserLogin';
import AdminLogin from './AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin-dashboard' }),
  Navigate: ({ to }) => <div>Redirected to {to}</div>,
}), { virtual: true });

const createToken = (payload) => {
  const encode = (value) => window.btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');

  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
};

describe('auth pages and protected routes', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('logs in a user and redirects to the library page', async () => {
    const token = createToken({ id: 'user-1', role: 'user' });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token }),
    });

    render(<UserLogin />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'reader@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/library'));
    expect(localStorage.getItem('libraria_token')).toBe(token);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('shows an inline error when user login fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Invalid email or password' }),
    });

    render(<UserLogin />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'reader@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
    expect(localStorage.getItem('libraria_token')).toBeNull();
  });

  it('blocks non-admin users from the admin login flow', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: createToken({ id: 'user-1', role: 'user' }) }),
    });

    render(<AdminLogin />);

    fireEvent.change(screen.getByLabelText('Admin ID'), {
      target: { value: 'reader@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Security Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Authorize Access' }));

    expect(await screen.findByText(/Access denied\. Admin only\./i)).toBeInTheDocument();
    expect(localStorage.getItem('libraria_token')).toBeNull();
  });

  it('allows admin users through the admin login flow', async () => {
    const token = createToken({ id: 'admin-1', role: 'admin' });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token }),
    });

    render(<AdminLogin />);

    fireEvent.change(screen.getByLabelText('Admin ID'), {
      target: { value: 'admin@libraria.com' },
    });
    fireEvent.change(screen.getByLabelText('Security Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Authorize Access' }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard'));
    expect(localStorage.getItem('libraria_token')).toBe(token);
  });

  it('redirects missing or non-admin users away from protected routes', async () => {
    const adminToken = createToken({ id: 'admin-1', role: 'admin' });

    const { rerender } = render(
      <ProtectedRoute adminOnly>
        <div>Secret Admin Page</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Redirected to /user-login')).toBeInTheDocument();

    localStorage.setItem('libraria_token', createToken({ id: 'user-1', role: 'user' }));
    rerender(
      <ProtectedRoute adminOnly>
        <div>Secret Admin Page</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Redirected to /user-login')).toBeInTheDocument();

    localStorage.setItem('libraria_token', adminToken);
    rerender(
      <ProtectedRoute adminOnly>
        <div>Secret Admin Page</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Secret Admin Page')).toBeInTheDocument();
  });
});
