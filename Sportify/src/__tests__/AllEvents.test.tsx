// src/__tests__/AllEvents.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AllEvents from '../pages/AllEvents';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../services/api';

// Mock the entire api module
vi.mock('../services/api');

describe('AllEvents component', () => {
  // Freeze the clock so `new Date()` === 2025-06-11T12:00:00Z
  const FIXED_TS = new Date('2025-06-11T12:00:00Z').valueOf();

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_TS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    (api.fetchEvents as any).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <AllEvents />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('loading-events')).toBeInTheDocument();
    expect(screen.getByText(/good things take time/i)).toBeInTheDocument();
  });

  it('displays "No events this week." when there are none', async () => {
    (api.fetchEvents as any).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AllEvents />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText('loading-events')).toBeNull();
    });

    expect(screen.getByText(/No events this week\./i)).toBeInTheDocument();
  });

  it('renders upcoming + past events, toggles view, and filters by search', async () => {
    const tomorrow = new Date('2025-06-12T12:00:00Z').toISOString();
    const yesterday = new Date('2025-06-10T12:00:00Z').toISOString();
    const sampleEvents = [
      {
        eventId: 1,
        title: 'Alpha Event',
        description: 'Desc',
        startDateTime: tomorrow,
        endDateTime: new Date('2025-06-13T12:00:00Z').toISOString(),
        location: 'Nowhere',
        visibility: 'public',
        imageUrl: '/img.jpg',
        participants: [],
        creatorUserId: 1
      },
      {
        eventId: 2,
        title: 'Beta Event',
        description: 'Desc',
        startDateTime: yesterday,
        endDateTime: new Date('2025-06-11T13:00:00Z').toISOString(),
        location: 'Somewhere',
        visibility: 'private',
        imageUrl: null,
        participants: [],
        creatorUserId: 2
      }
    ];

    (api.fetchEvents as any).mockResolvedValue(sampleEvents);
    (api.fetchUserById as any).mockImplementation(async (id: number) => ({
      username: `user${id}`
    }));
    (api.fetchProfile as any).mockImplementation(async (id: number) =>
      id === 1
        ? { profilePicture: '/pic1.png' }
        : { profilePicture: null }
    );

    const { container } = render(
      <MemoryRouter>
        <AllEvents />
      </MemoryRouter>
    );

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByLabelText('loading-events')).toBeNull();
    });

    // Both events appear in the "Events This Week" section
    const weekContainer = container.querySelector('.week-events') as HTMLElement;
    const week = within(weekContainer);
    expect(week.getByText(/Alpha Event/i)).toBeInTheDocument();
    expect(week.getByText(/Beta Event/i)).toBeInTheDocument();

    // Upcoming list only shows Alpha
    const upcomingContainer = container.querySelector('.upcoming-events') as HTMLElement;
    const upcoming = within(upcomingContainer);
    expect(upcoming.getByText(/Alpha Event/i)).toBeInTheDocument();
    expect(upcoming.queryByText(/Beta Event/i)).toBeNull();

    // Toggle to Past Events
    fireEvent.click(screen.getByRole('button', { name: /Past Events/i }));
    await waitFor(() => {
      const past = within(container.querySelector('.upcoming-events') as HTMLElement);
      expect(past.getByText(/Beta Event/i)).toBeInTheDocument();
      expect(past.queryByText(/Alpha Event/i)).toBeNull();
    });

    // Filter by "Beta" in past view
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'Beta' } });

    await waitFor(() => {
      const past = within(container.querySelector('.upcoming-events') as HTMLElement);
      expect(past.getByText(/Beta Event/i)).toBeInTheDocument();
      expect(past.queryByText(/Alpha Event/i)).toBeNull();
    });
  });
});
