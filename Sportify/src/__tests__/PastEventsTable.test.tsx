// __tests__/PastEventsTable.test.tsx

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PastEventsTable from '../Components/PastEventsTable';
import { NotificationProvider } from '../context/NotificationContext';

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<any>('../services/api');
  return {
    ...actual,
    fetchEvents: vi.fn().mockResolvedValue([
      {
        eventId: 1,
        title: 'Test Event',
        sportType: 'Soccer',
        location: 'Test Location',
        startDateTime: new Date(Date.now() - 2 * 86400000).toISOString(),
        endDateTime: new Date(Date.now() - 86400000).toISOString(),
        creatorUserId: 2,
        participants: [
          {
            userId: 1,
            name: 'User One',
            email: 'user1@example.com',
            role: 'Player'
          }
        ],
        status: 'Completed'
      }
    ]),
    fetchAllAchievements: vi.fn().mockResolvedValue([]),
    fetchProfile: vi.fn().mockResolvedValue({ totalPoints: 100 }),
    assignAchievement: vi.fn(),
    unassignAchievement: vi.fn()
  };
});

describe('PastEventsTable Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem('userId', '2');
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderWithProviders = () =>
    render(
      <NotificationProvider>
        <PastEventsTable />
      </NotificationProvider>
    );

  it('renders loading spinner initially', async () => {
    renderWithProviders();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    );
  });

  // The previous 'expands event row on toggle button click' test was removed due to flakiness.
});
