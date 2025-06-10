import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Style/ForgotPasswordModal.css';

interface Props {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [canReset, setCanReset] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(Number(id));
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerText = message;
    const container = document.getElementById('toast-container');
    if (container) {
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="forgot-modal">
        <h2 className="modal-heading">CHANGE PASSWORD</h2>

        {!canReset ? (
          <>
            <p>Enter your 6-digit 2FA code:</p>
            <div className="code-input-wrapper1">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`change-code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="code-box"
                  value={code[index] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    if (!val) return;
                    const newCode = code.split('');
                    newCode[index] = val;
                    setCode(newCode.join(''));
                    const next = document.getElementById(`change-code-${index + 1}`);
                    if (next) (next as HTMLInputElement).focus();
                  }}
                  onKeyDown={(e) => {
                    const prev = document.getElementById(`change-code-${index - 1}`);
                    const next = document.getElementById(`change-code-${index + 1}`);
                    if (e.key === 'Backspace') {
                      e.preventDefault();
                      const newCode = code.split('');
                      newCode[index] = '';
                      setCode(newCode.join(''));
                      if (index > 0 && prev) (prev as HTMLInputElement).focus();
                    } else if (e.key === 'ArrowLeft' && prev) {
                      e.preventDefault();
                      (prev as HTMLInputElement).focus();
                    } else if (e.key === 'ArrowRight' && next) {
                      e.preventDefault();
                      (next as HTMLInputElement).focus();
                    }
                  }}
                />
              ))}
            </div>
            <button
              className="login-btn"
              style={{ marginTop: '1rem' }}
              onClick={async () => {
                const res = await fetch(`http://localhost:5000/api/users/verify-2fa`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, code }),
                });
                if (!res.ok) {
                  showToast('Invalid code', 'error');
                  return;
                }
                setCanReset(true);
                showToast('2FA verified. Enter your new password.', 'success');
              }}
            >
              Verify
            </button>
          </>
        ) : (
          <>
            <p>Enter your new password:</p>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New password"
                className="EmailInput"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              className="login-btn"
              style={{ marginTop: '1rem' }}
              onClick={async () => {
                const res = await fetch(`http://localhost:5000/api/users/${userId}/reset-password`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ newPassword }),
                });
                if (!res.ok) {
                  showToast('Password reset failed', 'error');
                  return;
                }
                showToast('Password updated!', 'success');
                onClose();
              }}
            >
              Save
            </button>
          </>
        )}

        <button className="modal-back" onClick={onClose}>
          ← Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
