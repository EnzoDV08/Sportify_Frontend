// src/__tests__/OrganizationSignupPage.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// 1) Stub react-router-dom BEFORE importing the component
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return { ...actual, useNavigate: () => mockedNavigate };
});

// 2) Stub localStorage & confirm()
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => (key === 'userId' ? '1' : null)),
  setItem: vi.fn(),
});
vi.stubGlobal('confirm', vi.fn(() => true));

// 3) Stub global.fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import OrganizationSignupPage from '../pages/OrganizationSignupPage';

describe('OrganizationSignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('toggles password visibility', () => {
    render(<OrganizationSignupPage />);
    const passInput    = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const confirmInput = screen.getByPlaceholderText('Confirm Password') as HTMLInputElement;
    const [togglePass, toggleConfirm] = screen.getAllByRole('button');

    expect(passInput.type).toBe('password');
    fireEvent.click(togglePass);
    expect(passInput.type).toBe('text');

    expect(confirmInput.type).toBe('password');
    fireEvent.click(toggleConfirm);
    expect(confirmInput.type).toBe('text');
  });

  it('shows error on password mismatch', async () => {
    render(<OrganizationSignupPage />);
    fireEvent.change(screen.getByPlaceholderText('Organization Name'), { target: { value: 'Org' } });
    fireEvent.change(screen.getByPlaceholderText('Email'),            { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contact Person'),   { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText('Password'),         { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '456' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Inline field error
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    // Toast container also shows it
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    // No network call
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
