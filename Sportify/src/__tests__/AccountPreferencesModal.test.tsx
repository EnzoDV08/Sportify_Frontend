import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountPreferencesModal from '../Components/AccountPreferencesModal';
import { vi } from 'vitest';

describe('AccountPreferencesModal', () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    localStorage.setItem('userId', '1');
    vi.stubGlobal('fetch', vi.fn((url, _options) => {
      if (url.toString().includes('/api/Users/1') && !url.toString().includes('generate')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ isTwoFactorEnabled: false })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ qrCodeImageUrl: 'http://fake-qr.com/code.png', manualEntryKey: 'ABC123' })
      });
    }));
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<AccountPreferencesModal onClose={mockClose} />);
    expect(screen.getByText(/Loading 2FA status/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading 2FA status/i)).not.toBeInTheDocument());
  });

  it('renders toggle and handles 2FA enable', async () => {
    render(<AccountPreferencesModal onClose={mockClose} />);
    await waitFor(() => screen.getByText(/Enable Two-Factor Authentication/i));
    
    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('calls onClose when close button is clicked', async () => {
    render(<AccountPreferencesModal onClose={mockClose} />);
    const closeBtn = await screen.findByText(/Close/i);
    fireEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});
