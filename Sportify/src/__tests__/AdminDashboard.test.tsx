import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { MemoryRouter } from 'react-router-dom';
import { NotificationProvider } from '../context/NotificationContext';

// Mock child components
vi.mock('../Components/EventCreator', () => ({
  default: () => <div data-testid="event-creator">EventCreator Component</div>,
}));

vi.mock('../Components/PastEventsTable', () => ({
  default: () => <div data-testid="past-events-table">PastEventsTable Component</div>,
}));

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.setItem('userId', '2'); // Simulate admin user
});

const renderWithProviders = () => {
  return render(
    <MemoryRouter>
      <NotificationProvider>
        <AdminDashboard />
      </NotificationProvider>
    </MemoryRouter>
  );
};

describe('AdminDashboard Page', () => {
  it('renders default tab with EventCreator', () => {
    renderWithProviders();
    expect(screen.getByTestId('event-creator')).toBeInTheDocument();
    expect(screen.queryByTestId('past-events-table')).not.toBeInTheDocument();
  });

  it('switches to Past Events tab and shows PastEventsTable', async () => {
    renderWithProviders();
    const pastEventsTab = screen.getByRole('button', { name: /📂 Past Events/i });
    fireEvent.click(pastEventsTab);

    await waitFor(() => {
      expect(screen.getByTestId('past-events-table')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('event-creator')).not.toBeInTheDocument();
  });

  it('switches back to Create Event tab from Past Events', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole('button', { name: /📂 Past Events/i }));
    await waitFor(() => {
      expect(screen.getByTestId('past-events-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /📅 Create Event/i }));

    await waitFor(() => {
      expect(screen.getByTestId('event-creator')).toBeInTheDocument();
    });
  });
});
