// src/__tests__/MainLayout.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// 1) Mock Sidebar & AchievementNotification before importing MainLayout
vi.mock('../Components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock('../Components/AchievementNotification', () => ({
  __esModule: true,
  default: () => <div data-testid="notif">Notifications</div>,
}));

import MainLayout from '../pages/MainLayout';

describe('MainLayout', () => {
  it('renders Sidebar, Outlet content, and AchievementNotification', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={<div data-testid="child">Child Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Sidebar rendered once
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // Outlet child rendered
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');

    // Notification rendered once
    expect(screen.getByTestId('notif')).toBeInTheDocument();

    // Check container structure
    const main = document.querySelector('.main-layout');
    expect(main).toBeInTheDocument();

    const page = document.querySelector('.page-container');
    expect(page).toBeInTheDocument();
  });
});
