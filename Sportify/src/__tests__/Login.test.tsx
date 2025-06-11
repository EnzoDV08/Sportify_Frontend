import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Mock localStorage
vi.stubGlobal('localStorage', {
  setItem: vi.fn(),
  getItem: vi.fn(),
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('LoginPage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  const renderLogin = () =>
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );

  it('renders login form and submits successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        userId: 1,
        userType: 'user',
        isTwoFactorEnabled: false,
      }),
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith('userType', 'user');
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', 1);
    });
  });

  it('shows error on failed login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Invalid credentials',
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });
});
