// src/__tests__/MyEvents.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Stub localStorage & confirm()
vi.stubGlobal('localStorage', { getItem: vi.fn(() => '1') });
vi.stubGlobal('confirm', vi.fn(() => true));

// 1) Mock services/api before importing MyEvents
vi.mock('../services/api', () => ({
  fetchEvents:          vi.fn(),
  deleteEvent:          vi.fn(),
  fetchPendingRequests: vi.fn(),
  approveRequest:       vi.fn(),
  rejectRequest:        vi.fn(),
}));

// 2) Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: vi.fn(),
  ToastContainer: () => null,
}));

import MyEvents from '../pages/MyEvents';
import {
  fetchEvents,
  deleteEvent,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
} from '../services/api';
import { toast } from 'react-toastify';

describe('MyEvents component', () => {
  const userId = 1;
  const sampleEvents = [
    { eventId: 1, creatorUserId: 1, title: 'My Event', location: 'A', startDateTime: new Date().toISOString(), endDateTime: new Date().toISOString(), description: '' },
    { eventId: 2, creatorUserId: 2, title: 'Other Event', location: 'B', startDateTime: new Date().toISOString(), endDateTime: new Date().toISOString(), description: '' },
  ];
  const sampleRequests = [
    { eventId: 1, userId: 3, status: 'pending', user: { userId: 3, name: 'Alice', email: 'a@a.com' }, event: { eventId: 1, title: 'My Event' } }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner then empty state', async () => {
    (fetchEvents as any).mockResolvedValue([]);
    (fetchPendingRequests as any).mockResolvedValue([]);

    render(<MyEvents />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText('loading-events')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByLabelText('loading-events')).toBeNull());

    expect(screen.getByText(/You haven't created any events yet\./i)).toBeInTheDocument();
    // heading always shows
    expect(screen.getByText(/Pending Join Requests/)).toBeInTheDocument();
    expect(screen.queryByText(/wants to join/)).toBeNull();
  });

  it('renders only my events and pending requests', async () => {
    (fetchEvents as any).mockResolvedValue(sampleEvents);
    (fetchPendingRequests as any).mockResolvedValue(sampleRequests);

    render(<MyEvents />, { wrapper: MemoryRouter });

    await waitFor(() => expect(fetchEvents).toHaveBeenCalled());

    // only My Event card
    expect(screen.getByAltText('My Event')).toBeInTheDocument();
    expect(screen.queryByAltText('Other Event')).toBeNull();

    await waitFor(() => expect(fetchPendingRequests).toHaveBeenCalled());

    // simpler: check for the standalone text node
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/wants to join/)).toBeInTheDocument();
  });

  it('deletes an event, updates list, and shows toast', async () => {
    (fetchEvents as any).mockResolvedValue([{ eventId: 1, creatorUserId: 1, title: 'My Event', location: '', startDateTime: '', endDateTime: '', description: '' }]);
    (fetchPendingRequests as any).mockResolvedValue([]);
    (deleteEvent as any).mockResolvedValue({});

    render(<MyEvents />, { wrapper: MemoryRouter });
    await waitFor(() => expect(fetchEvents).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await waitFor(() => expect(deleteEvent).toHaveBeenCalledWith(1));

    expect(screen.getByText(/You haven't created any events yet\./i)).toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith('Event deleted successfully!', expect.any(Object));
  });

  it('approves a request, removes it, and shows toast', async () => {
    (fetchEvents as any).mockResolvedValue([]);
    (fetchPendingRequests as any).mockResolvedValue(sampleRequests);
    (approveRequest as any).mockResolvedValue({});

    render(<MyEvents />, { wrapper: MemoryRouter });
    await waitFor(() => expect(fetchPendingRequests).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Accept/i }));
    await waitFor(() => expect(approveRequest).toHaveBeenCalledWith(1, 3, userId));

    expect(screen.queryByText(/wants to join/)).toBeNull();
    expect(toast).toHaveBeenCalledWith('User approved successfully!', expect.any(Object));
  });

  it('rejects a request, removes it, and shows toast', async () => {
    (fetchEvents as any).mockResolvedValue([]);
    (fetchPendingRequests as any).mockResolvedValue(sampleRequests);
    (rejectRequest as any).mockResolvedValue({});

    render(<MyEvents />, { wrapper: MemoryRouter });
    await waitFor(() => expect(fetchPendingRequests).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    await waitFor(() => expect(rejectRequest).toHaveBeenCalledWith(1, 3, userId));

    expect(screen.queryByText(/wants to join/)).toBeNull();
    expect(toast).toHaveBeenCalledWith('User rejected.', expect.any(Object));
  });
});
