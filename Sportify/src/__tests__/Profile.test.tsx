// src/__tests__/Profile.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../services/api';
import { Event } from '../models/event';
import Profile from '../pages/Profile';

// stub localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => '1'),
});

// stub fetch for the four calls in useEffect
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

const sampleUser = { name: 'John Doe', email: 'john@example.com' };
const sampleProfile = {
  userId: 1,
  favoriteSports: 'Soccer',
  age: 30,
  totalPoints: 42,
  bio: 'Loves sports',
  profilePicture: undefined,
};
const sampleUserAchievements = [
  { userAchievementId: 1, userId: 1, achievementId: 2, dateAwarded: '2025-01-01T00:00:00Z' },
];
const sampleAllAchievements = [
  {
    achievementId: 2,
    title: 'Top Scorer',
    description: 'Most goals',
    sportType: 'Football',
    iconUrl: '/icon.png',
    points: 10,
  },
];
// now include the missing fields so it satisfies your Event interface:
const sampleEvents: Event[] = [
  {
    eventId: 5,
    creatorUserId: 1,
    adminId: 1,
    title: 'Fun Match',
    description: '',
    startDateTime: '2025-07-10T12:00:00Z',
    endDateTime: '2025-07-10T14:00:00Z',
    requiredItems: '',
    location: 'Stadium',
    type: 'match',
    visibility: 'public',
    imageUrl: '/fallback.jpg',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  // 1) user
  fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleUser) });
  // 2) profile
  fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleProfile) });
  // 3) user achievements
  fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleUserAchievements) });
  // 4) all achievements
  fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleAllAchievements) });
  // spy on fetchEvents
  vi.spyOn(api, 'fetchEvents').mockResolvedValue(sampleEvents);
});

describe('Profile page', () => {
  it('loads and displays user info, achievements, and recommended events', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // wait for all 4 fetch(...) + fetchEvents()
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect(api.fetchEvents).toHaveBeenCalled();
    });

    // header
    expect(screen.getByText(/John Doe's Profile/i)).toBeInTheDocument();
    // email & stats
    expect(screen.getByText(/john@example\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Soccer/)).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    // bio
    expect(screen.getByText('Loves sports')).toBeInTheDocument();
    // achievement
    expect(screen.getByText('Top Scorer')).toBeInTheDocument();
    // event recommendation
    expect(screen.getByRole('link', { name: /View/i })).toHaveAttribute('href', '/events/5');
    expect(screen.getByText('Fun Match')).toBeInTheDocument();
  });
});
