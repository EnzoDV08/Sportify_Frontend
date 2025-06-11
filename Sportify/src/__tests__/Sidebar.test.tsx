import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Components/Sidebar'; // ✅ Make sure path matches your actual file structure
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ✅ Mock child components
vi.mock('../Components/FriendSidebar', () => ({
  default: () => <div data-testid="friend-sidebar" />
}));

vi.mock('../Components/AccountPreferencesModal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="account-preferences">
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('../Components/ChangePasswordModal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="change-password">
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.setItem('userId', '1');
    localStorage.setItem('userType', 'user');
    localStorage.setItem('sidebarExpanded', 'true');

    global.fetch = vi.fn((url) => {
      if (url.includes('/api/Users/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'Test User', email: 'test@example.com' })
        });
      }
      if (url.includes('/api/Profiles/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ profilePicture: '' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders without crashing and displays profile info', async () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    expect(await screen.findByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('toggles the sidebar collapse state', () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    const toggleBtn = screen.getAllByRole('button')[0]; // fallback selector
    fireEvent.click(toggleBtn);
    expect(localStorage.getItem('sidebarExpanded')).toBe('false');
  });

  it('clears localStorage and redirects on sign out', () => {
    const originalLocation = window.location;

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' }
    });

    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText(/Sign Out/i));
    expect(localStorage.getItem('userId')).toBeNull();
    expect(window.location.href).toBe('/auth/login');
  });
});
