import React, { useState, useEffect } from 'react';
import '../Style/AccountPreferencesModal.css';

interface Props {
  onClose: () => void;
}

interface QrSetupData {
  qrCodeImageUrl: string;
  manualEntryKey: string;
}

const AccountPreferencesModal: React.FC<Props> = ({ onClose }) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [qrData, setQrData] = useState<QrSetupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [is2FAVerified, setIs2FAVerified] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/Users/${userId}`);
        const data = await res.json();
        const enabled = Boolean(data.isTwoFactorEnabled);
        setIsEnabled(enabled);
        setIs2FAVerified(enabled);

        if (enabled && !data.twoFactorSecret) {
          const genRes = await fetch(`http://localhost:5000/api/Users/${userId}/generate-2fa`, {
            method: 'POST',
          });
          const setupData: QrSetupData = await genRes.json();
          setupData.qrCodeImageUrl = setupData.qrCodeImageUrl.replace(/^"|"$/g, '');
          setQrData(setupData);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load 2FA settings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const toggle2FA = async () => {
    if (isEnabled && is2FAVerified) return;

    try {
      const res = await fetch(`http://localhost:5000/api/Users/${userId}/toggle-2fa`, {
        method: 'PUT',
      });

      const updated = await res.json();
      const twoFA = Boolean(updated.isTwoFactorEnabled);
      setIsEnabled(twoFA);

      if (twoFA) {
        const genRes = await fetch(`http://localhost:5000/api/Users/${userId}/generate-2fa`, {
          method: 'POST',
        });
        const setupData: QrSetupData = await genRes.json();
        setupData.qrCodeImageUrl = setupData.qrCodeImageUrl.replace(/^"|"$/g, '');
        setQrData(setupData);
      } else {
        setQrData(null);
        setVerificationCode('');
        setIs2FAVerified(false);
        alert('🔓 Two-Factor Authentication has been disabled.');
      }
    } catch (err) {
      console.error('Toggle error:', err);
      setError('Failed to toggle or generate 2FA');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/Users/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: verificationCode }),
      });

      if (!res.ok) throw new Error('Verification failed');
      alert('✅ 2FA verified successfully!');
      setIs2FAVerified(true);
    } catch (err) {
      console.error(err);
      alert('❌ Invalid verification code');
    }
  };

  const handleDisable = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/Users/disable-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: disableCode }),
      });

      if (!res.ok) throw new Error('Disable failed');
      alert('🔓 Two-Factor Authentication disabled!');
      setIsEnabled(false);
      setQrData(null);
      setDisableCode('');
      setIs2FAVerified(false);
    } catch (err) {
      console.error(err);
      alert('❌ Incorrect code. Could not disable 2FA.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-2fa-container">
        <div className="modal-2fa-header">
          <h2 className="modal-heading">Account Preferences</h2>
          <p className="modal-subheading">Manage your 2FA security settings</p>
        </div>

        {isLoading ? (
          <p>Loading 2FA status...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <p style={{ fontWeight: 600 }}>Enable Two-Factor Authentication</p>
            {isEnabled !== null && (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={toggle2FA}
                  disabled={isEnabled && is2FAVerified}
                />
                <span className="slider"></span>
              </label>
            )}

            {isEnabled && qrData && !is2FAVerified && (
              <div className="qr-section">
                <p>Scan this QR code with Google Authenticator:</p>
                <img src={qrData.qrCodeImageUrl} alt="QR Code" className="qr-img" />
                <p>Manual code:</p>
                <code>{qrData.manualEntryKey}</code>
                <div className="verify-section">
                  <div className="code-input-wrapper">
                    {Array(6).fill(0).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="code-box"
                        value={verificationCode[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (!val) return;

                          const newCode = verificationCode.split('');
                          newCode[i] = val;
                          setVerificationCode(newCode.join('').slice(0, 6));

                          const next = document.getElementById(`code-${i + 1}`);
                          if (next) (next as HTMLInputElement).focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            const newCode = verificationCode.split('');
                            newCode[i] = '';
                            setVerificationCode(newCode.join(''));

                            const prev = document.getElementById(`code-${i - 1}`);
                            if (prev) (prev as HTMLInputElement).focus();
                          }
                        }}
                        id={`code-${i}`}
                      />
                    ))}
                  </div>
                  <button className="verify-btn" onClick={handleVerify}>Verify Code</button>
                </div>
              </div>
            )}

            {isEnabled && is2FAVerified && (
              <div className="disable-section">
                <p style={{ fontWeight: 500 }}>
                  Disable Two-Factor Authentication:
                </p>
                <div className="disable-code-wrapper">
                  {Array(6).fill(0).map((_, i) => (
                    <input
                      key={`disable-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="code-box"
                      value={disableCode[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (!val) return;

                        const newCode = disableCode.split('');
                        newCode[i] = val;
                        setDisableCode(newCode.join('').slice(0, 6));

                        const next = document.getElementById(`disable-code-${i + 1}`);
                        if (next) (next as HTMLInputElement).focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          e.preventDefault();
                          const newCode = disableCode.split('');
                          newCode[i] = '';
                          setDisableCode(newCode.join(''));

                          const prev = document.getElementById(`disable-code-${i - 1}`);
                          if (prev) (prev as HTMLInputElement).focus();
                        }
                      }}
                      id={`disable-code-${i}`}
                    />
                  ))}
                </div>
                <button className="verify-btn" style={{ backgroundColor: '#e74c3c' }} onClick={handleDisable}>
                  Disable 2FA
                </button>
              </div>
            )}
          </>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AccountPreferencesModal;
