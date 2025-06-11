import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordModal from '../Components/ChangePasswordModal';

const mockOnClose = vi.fn();

beforeEach(() => {
  localStorage.setItem('userId', '1');
  vi.resetAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('ChangePasswordModal', () => {
  it('renders modal and inputs initially', () => {
    render(<ChangePasswordModal onClose={mockOnClose} />);
    expect(screen.getByText(/CHANGE PASSWORD/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your 6-digit 2FA code/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6); // 6-digit inputs
  });

  it('verifies 2FA code and shows password field', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true });

    render(<ChangePasswordModal onClose={mockOnClose} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    fireEvent.change(inputs[4], { target: { value: '5' } });
    fireEvent.change(inputs[5], { target: { value: '6' } });

    const verifyBtn = screen.getByRole('button', { name: /verify/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Enter your new password/i)).toBeInTheDocument();
    });
  });

  it('submits new password successfully', async () => {
    // First mock 2FA success
    (fetch as unknown as jest.Mock)
      .mockResolvedValueOnce({ ok: true } as Response) // verify 2FA
      .mockResolvedValueOnce({ ok: true } as Response); // reset password

    render(<ChangePasswordModal onClose={mockOnClose} />);

    // Fill 2FA
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });

    const verifyBtn = screen.getByRole('button', { name: /verify/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Enter your new password/i)).toBeInTheDocument();
    });

    // Fill password and click save
    const passwordInput = screen.getByPlaceholderText(/New password/i);
    fireEvent.change(passwordInput, { target: { value: 'NewSecurePass123!' } });

    const saveBtn = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('clicks cancel button', () => {
    render(<ChangePasswordModal onClose={mockOnClose} />);
    const cancelBtn = screen.getByText(/← Cancel/i);
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
