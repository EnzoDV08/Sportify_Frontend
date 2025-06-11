import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateEvent from '../pages/CreateEvent';
import * as api from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

// Cast the mocked function for type safety
const mockCreateEvent = api.createEvent as unknown as ReturnType<typeof vi.fn>;

describe('CreateEvent', () => {
  beforeEach(() => {
    mockCreateEvent.mockResolvedValue({});
    localStorage.setItem('userId', '1');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the form and allows input', () => {
    render(<CreateEvent />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Soccer Match' },
    });
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Soccer Match');
  });

  it('calls createEvent on valid form submission', async () => {
    render(<CreateEvent />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Event' } });
    fireEvent.change(screen.getByLabelText(/Start Date & Time/i), {
      target: { value: '2025-06-12T10:00' },
    });
    fireEvent.change(screen.getByLabelText(/End Date & Time/i), {
      target: { value: '2025-06-12T12:00' },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Stadium' } });
    fireEvent.change(screen.getByLabelText(/Sport Type/i), { target: { value: 'Soccer' } });
    fireEvent.change(screen.getByLabelText(/^Type$/i), { target: { value: 'training' } });
    fireEvent.change(screen.getByLabelText(/Visibility/i), { target: { value: 'public' } });
    fireEvent.change(screen.getByLabelText(/Required Items/i), {
      target: { value: 'Water bottle' },
    });

    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() =>
      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Event',
          startDateTime: '2025-06-12T10:00',
          endDateTime: '2025-06-12T12:00',
          location: 'Stadium',
          type: 'training',
          sportType: 'Soccer',
          visibility: 'public',
          requiredItems: 'Water bottle',
          status: 'upcoming',
          imageUrl: expect.any(String),
          invitedUserIds: [],
        }),
        1
      )
    );
  });

  it('handles API failure gracefully', async () => {
    mockCreateEvent.mockRejectedValueOnce(new Error('Network Error'));
    render(<CreateEvent />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Error Event' } });
    fireEvent.change(screen.getByLabelText(/Start Date & Time/i), {
      target: { value: '2025-06-12T10:00' },
    });
    fireEvent.change(screen.getByLabelText(/End Date & Time/i), {
      target: { value: '2025-06-12T12:00' },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Nowhere' } });
    fireEvent.change(screen.getByLabelText(/Sport Type/i), { target: { value: 'Soccer' } });
    fireEvent.change(screen.getByLabelText(/^Type$/i), { target: { value: 'match' } });
    fireEvent.change(screen.getByLabelText(/Visibility/i), { target: { value: 'private' } });
    fireEvent.change(screen.getByLabelText(/Required Items/i), {
      target: { value: 'Shoes' },
    });

    fireEvent.click(screen.getByText(/Create Event/i));

    await waitFor(() =>
      expect(mockCreateEvent).toHaveBeenCalled()
    );
  });
});
