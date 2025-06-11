// src/__tests__/EditEvent.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// 1) Mock react-router-dom before importing EditEvent
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockedNavigate,
  };
});

// 2) Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => null,
}));

// 3) Mock our API
vi.mock('../services/api');

import EditEvent from '../pages/EditEvent';
import * as api from '../services/api';
import { toast } from 'react-toastify';

describe('EditEvent component', () => {
  const sampleEvent = {
    eventId: 1,
    title: 'Sample Title',
    description: 'Sample Desc',
    startDateTime: '2025-06-11T10:00:00Z',
    endDateTime:   '2025-06-11T12:00:00Z',
    requiredItems:'Water bottle',
    location:     'Central Park',
    type:         'training',
    visibility:   'public',
    imageUrl:     null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and populates the form', async () => {
    (api.fetchSingleEvent as any).mockResolvedValue(sampleEvent);

    render(<EditEvent />);

    // loading spinner
    expect(screen.getByLabelText('loading-events')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByLabelText('loading-events')).toBeNull());

    // form fields
    expect(screen.getByDisplayValue('Sample Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sample Desc')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-06-11T10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-06-11T12:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Water bottle')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Central Park')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Training')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Public')).toBeInTheDocument();
  });

  it('shows initial image preview if eventData.imageUrl is set', async () => {
    (api.fetchSingleEvent as any).mockResolvedValue({ ...sampleEvent, imageUrl: '/pic.jpg' });

    render(<EditEvent />);
    await waitFor(() => expect(screen.queryByLabelText('loading-events')).toBeNull());

    const img = screen.getByAltText('Selected');
    expect(img).toHaveAttribute('src', '/pic.jpg');
  });

  it('submits updated data, calls success toast, and navigates', async () => {
    (api.fetchSingleEvent as any).mockResolvedValue(sampleEvent);
    (api.updateEvent as any).mockResolvedValue({});

    render(<EditEvent />);
    await waitFor(() => expect(screen.queryByLabelText('loading-events')).toBeNull());

    // change title & submit
    fireEvent.change(screen.getByDisplayValue('Sample Title'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Event/i }));

    // API call
    await waitFor(() =>
      expect(api.updateEvent).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: 'Updated Title' })
      )
    );

    // toast.success
    expect(toast.success).toHaveBeenCalledWith(
      'Event updated successfully!',
      expect.any(Object)
    );

    // wait up to 3s for navigation
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/events/1'), {
      timeout: 3000,
    });
  });

  it('calls error toast when update fails and does not navigate', async () => {
    (api.fetchSingleEvent as any).mockResolvedValue(sampleEvent);
    (api.updateEvent as any).mockRejectedValue(new Error('fail'));

    render(<EditEvent />);
    await waitFor(() => expect(screen.queryByLabelText('loading-events')).toBeNull());

    fireEvent.click(screen.getByRole('button', { name: /Update Event/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to update event.',
        expect.any(Object)
      )
    );

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it('logs an error when fetchSingleEvent fails', async () => {
    const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (api.fetchSingleEvent as any).mockRejectedValue(new Error('fetch fail'));

    render(<EditEvent />);
    await waitFor(() => expect(logSpy).toHaveBeenCalledWith(expect.any(Error)));
    logSpy.mockRestore();
  });
});
