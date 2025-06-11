// src/__tests__/EditProfile.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// 1) Stub react-router-dom before importing
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return { ...actual, useNavigate: () => mockedNavigate };
});

// 2) Stub localStorage and alert
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => '1'),
});
vi.stubGlobal('alert', vi.fn());

// 3) Stub fetch globally
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import EditProfile from '../pages/EditProfile';

describe('EditProfile component', () => {
  const sampleUser = { name: 'John Doe', email: 'john@example.com' };
  const sampleProfile = {
    profilePicture: 'pic.png',
    location: 'Somewhere',
    interests: 'Coding',
    favoriteSports: 'Soccer',
    availability: 'Weekends',
    bio: 'Hello!',
    phoneNumber: '123',
    socialMediaLink: 'twitter.com/john',
    gender: 'M',
    age: 30,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    // First two fetches: GET user and profile
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleUser) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(sampleProfile) });
  });

  it('fetches and populates user + profile data', async () => {
    render(<EditProfile />);

    // wait for GET /api/Users/1
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/Users/1'),
      )
    );
    // wait for GET /api/Profiles/1
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/Profiles/1'),
      )
    );

    // verify form values
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Somewhere')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Soccer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello!')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('sends upload when selecting a file', async () => {
    render(<EditProfile />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    // mock upload response
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ imageUrl: 'uploaded.png' })
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['blob'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/upload'),
        expect.objectContaining({ method: 'POST' })
      )
    );
  });

  it('submits updates successfully and navigates', async () => {
    render(<EditProfile />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByDisplayValue('john@example.com'), { target: { value: 'jane@example.com' } });

    // mock PUTs
    fetchMock.mockResolvedValueOnce({ ok: true });
    fetchMock.mockResolvedValueOnce({ ok: true });

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/Users/1'),
        expect.objectContaining({ method: 'PUT' })
      )
    );
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/Profiles/1'),
        expect.objectContaining({ method: 'PUT' })
      )
    );

    expect(alert).toHaveBeenCalledWith('Profile updated successfully!');
    expect(mockedNavigate).toHaveBeenCalledWith('/profile');
  });

  it('shows alert on update failure and does not navigate', async () => {
    render(<EditProfile />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    fetchMock.mockRejectedValueOnce(new Error('fail'));

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith('Update failed.')
    );
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
