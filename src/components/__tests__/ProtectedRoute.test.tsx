import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '../../contexts/AuthContext';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state while loading', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      loading: true,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Navigate component redirects, so content shouldn't be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows admin to access admin routes', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAdmin={true}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects non-admin users from admin routes', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireAdmin={true}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Non-admin should be redirected
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
