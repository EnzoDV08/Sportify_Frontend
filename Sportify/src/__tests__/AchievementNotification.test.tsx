// src/__tests__/AchievementNotification.test.tsx
import { render, screen } from '@testing-library/react';
import AchievementNotification from '../Components/AchievementNotification';
import { vi } from 'vitest';
import { useNotification } from '../context/NotificationContext';

// ✅ Mock framer-motion to avoid animation issues in test
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any = {}) => <div {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));


// ✅ Mock NotificationContext
vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

describe('AchievementNotification', () => {
  it('renders notifications when present', () => {
    (useNotification as any).mockReturnValue({
      notifications: [
        {
          id: 1,
          title: 'Achievement Unlocked',
          message: 'You completed your first event!',
          iconUrl: '/icon.png',
        },
      ],
    });

    render(<AchievementNotification />);

    expect(screen.getByText(/Achievement Unlocked/i)).toBeInTheDocument();
    expect(screen.getByText(/You completed your first event!/i)).toBeInTheDocument();
    expect(screen.getByAltText(/icon/i)).toHaveAttribute('src', '/icon.png');
  });

  it('renders nothing if no notifications are present', () => {
    (useNotification as any).mockReturnValue({
      notifications: [],
    });

    render(<AchievementNotification />);

    // Expect no title/message to be in the document
    expect(screen.queryByText(/Achievement Unlocked/i)).not.toBeInTheDocument();
  });
});
