import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EventsNearby from '../Components/EventsNearby';
import { fetchEvents, fetchProfile } from '../services/api';

// Mock API services
vi.mock('../services/api', async () => ({
  fetchEvents: vi.fn(),
  fetchProfile: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
  };
});

describe('EventsNearby', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Provide empty default values
    (fetchEvents as any).mockResolvedValue([]);
    (fetchProfile as any).mockResolvedValue({ profilePicture: 'default.png' });

    // Mock geolocation API
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url === 'https://ipapi.co/json/') {
        return Promise.resolve({
          json: () => Promise.resolve({ region: 'Gauteng' }),
        });
      }
      return Promise.reject('Unexpected fetch');
    }));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders loading spinner initially', () => {
    render(<EventsNearby />);
    expect(screen.getByText(/EVENTS NEARBY/i)).toBeInTheDocument();
    // Now the spinner must have role="status" in your component
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders filtered nearby events after load', async () => {
    (fetchEvents as any).mockResolvedValue([
      {
        eventId: 1,
        title: 'Soccer in Sandton',
        location: 'Gauteng',
        startDateTime: new Date().toISOString(),
        imageUrl: '',
        creatorUserId: 3,
        creator: { name: 'John Doe' },
        participants: [{ userId: 4 }, { userId: 5 }],
      },
    ]);

    render(<EventsNearby />);
    await waitFor(() => {
      expect(screen.getByText('Soccer in Sandton')).toBeInTheDocument();
      expect(screen.getByText(/HOSTED BY JOHN DOE/i)).toBeInTheDocument();
    });
  });

  it('displays "HOSTED BY BEARDED" if creatorUserId === 2', async () => {
    (fetchEvents as any).mockResolvedValue([
      {
        eventId: 2,
        title: 'Karate Meetup',
        location: 'Gauteng',
        startDateTime: new Date().toISOString(),
        imageUrl: '',
        creatorUserId: 2,
        creator: { name: 'Admin' },
        participants: [],
      },
    ]);

    render(<EventsNearby />);
    await waitFor(() => {
      expect(screen.getByText(/HOSTED BY BEARDED/i)).toBeInTheDocument();
    });
  });

  it('falls back to "gauteng" if geo API fails', async () => {
    (fetchEvents as any).mockResolvedValue([
      {
        eventId: 3,
        title: 'Cycling Club',
        location: 'Gauteng',
        startDateTime: new Date().toISOString(),
        imageUrl: '',
        creatorUserId: 5,
        creator: { name: 'Lara' },
        participants: [],
      },
    ]);

    vi.stubGlobal('fetch', vi.fn(() => Promise.reject('geo API error')));

    render(<EventsNearby />);
    await waitFor(() => {
      expect(screen.getByText('Cycling Club')).toBeInTheDocument();
    });
  });
});
