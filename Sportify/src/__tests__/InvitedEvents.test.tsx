// src/__tests__/InvitedEvents.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Stub localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => '1'),
});

// Mock our API module
vi.mock('../services/api', () => ({
  fetchInvitedEvents: vi.fn(),
  acceptInvite: vi.fn(),
  rejectInvite: vi.fn(),
}));

import {
  fetchInvitedEvents,
  acceptInvite,
  rejectInvite,
} from '../services/api';
import InvitedEvents from '../pages/InvitedEvents';

// Silence console.error
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('InvitedEvents component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows message when there are no invites', async () => {
    (fetchInvitedEvents as any).mockResolvedValue([]);

    render(<InvitedEvents />);

    await waitFor(() =>
      expect(fetchInvitedEvents).toHaveBeenCalledWith(1)
    );

    expect(screen.getByText(/No event invites yet\./i)).toBeInTheDocument();
  });

  it('renders a list of invites', async () => {
    const events = [
      { eventId: 1, title: 'Alpha', location: 'Loc A', startDateTime: new Date('2025-06-12T10:00:00Z').toISOString(), description: 'Desc A' },
      { eventId: 2, title: 'Beta',  location: 'Loc B', startDateTime: new Date('2025-06-13T11:00:00Z').toISOString(), description: 'Desc B' },
    ];
    (fetchInvitedEvents as any).mockResolvedValue(events);

    render(<InvitedEvents />);

    await waitFor(() =>
      expect(fetchInvitedEvents).toHaveBeenCalledWith(1)
    );

    for (const e of events) {
      expect(screen.getByText(e.title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(e.location))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(e.description))).toBeInTheDocument();
    }
  });

  it('accepts an invite and reloads list', async () => {
    const eventsFirst = [
      { eventId: 1, title: 'Gamma', location: 'Loc G', startDateTime: new Date().toISOString(), description: 'Desc G' }
    ];
    // first load returns one, second load returns empty
    (fetchInvitedEvents as any)
      .mockResolvedValueOnce(eventsFirst)
      .mockResolvedValueOnce([]);
    (acceptInvite as any).mockResolvedValue({});

    render(<InvitedEvents />);
    await waitFor(() => expect(fetchInvitedEvents).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: /Accept/i }));

    await waitFor(() => expect(acceptInvite).toHaveBeenCalledWith(1, 1));
    await waitFor(() => expect(fetchInvitedEvents).toHaveBeenCalledTimes(2));

    expect(screen.getByText(/No event invites yet\./i)).toBeInTheDocument();
  });

  it('rejects an invite and removes it from list', async () => {
    const events = [
      { eventId: 1, title: 'Delta', location: 'Loc D', startDateTime: new Date().toISOString(), description: 'Desc D' },
      { eventId: 2, title: 'Epsilon', location: 'Loc E', startDateTime: new Date().toISOString(), description: 'Desc E' },
    ];
    (fetchInvitedEvents as any).mockResolvedValue(events);
    (rejectInvite as any).mockResolvedValue({});

    render(<InvitedEvents />);
    await waitFor(() => expect(fetchInvitedEvents).toHaveBeenCalledWith(1));

    fireEvent.click(screen.getAllByRole('button', { name: /Reject/i })[0]);
    await waitFor(() => expect(rejectInvite).toHaveBeenCalledWith(1, 1));

    // After reject, only second event remains
    expect(screen.queryByText('Delta')).toBeNull();
    expect(screen.getByText('Epsilon')).toBeInTheDocument();
  });
});
