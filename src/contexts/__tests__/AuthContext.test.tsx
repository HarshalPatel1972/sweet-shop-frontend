import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import apiClient from '../../lib/api';

// Mock the API client
vi.mock('../../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Test component that uses the hook
function TestComponent() {
  const { user, token, isAuthenticated, isAdmin, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="token">{token ? 'Has token' : 'No token'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <div data-testid="is-admin">{isAdmin ? 'Admin' : 'User'}</div>

      <button
        data-testid="login-btn"
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>

      <button
        data-testid="register-btn"
        onClick={() => register('newuser@example.com', 'password123')}
      >
        Register
      </button>

      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders children with initial state (not authenticated)', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
  });

  it('handles login successfully', async () => {
    const user = userEvent.setup();
    const mockApiClient = apiClient as any;
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'test-token-123',
        user: { id: 1, email: 'test@example.com', role: 'User' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    await user.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('token')).toHaveTextContent('Has token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    expect(localStorage.getItem('token')).toBe('test-token-123');
  });

  it('handles registration successfully', async () => {
    const user = userEvent.setup();
    const mockApiClient = apiClient as any;
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'new-token-456',
        user: { id: 2, email: 'newuser@example.com', role: 'User' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerBtn = screen.getByTestId('register-btn');
    await user.click(registerBtn);

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('newuser@example.com');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    expect(localStorage.getItem('token')).toBe('new-token-456');
  });

  it('sets isAdmin to true for admin users', async () => {
    const user = userEvent.setup();
    const mockApiClient = apiClient as any;
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'admin-token',
        user: { id: 1, email: 'admin@example.com', role: 'Admin' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByTestId('login-btn');
    await user.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Admin');
    });
  });

  it('handles logout', async () => {
    const user = userEvent.setup();
    const mockApiClient = apiClient as any;
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        user: { id: 1, email: 'test@example.com', role: 'User' },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    const loginBtn = screen.getByTestId('login-btn');
    await user.click(loginBtn);

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    // Then logout
    const logoutBtn = screen.getByTestId('logout-btn');
    await user.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores session from localStorage on mount', () => {
    localStorage.setItem('token', 'persisted-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Token should be restored from localStorage
    expect(screen.getByTestId('token')).toHaveTextContent('Has token');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within AuthProvider');

    consoleSpy.mockRestore();
  });
});
