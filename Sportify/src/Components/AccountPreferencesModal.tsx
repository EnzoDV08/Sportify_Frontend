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
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();

        const backendValue = Boolean(data.isTwoFactorEnabled);
        setIsEnabled(backendValue);
        setIs2FAVerified(backendValue);

        if (backendValue && data.twoFactorSecret) {
          const genRes = await fetch(`http://localhost:5000/api/Users/${userId}/generate-2fa`, {
            method: 'POST',
          });

          if (!genRes.ok) throw new Error('Failed to get QR');
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
    if (isEnabled && is2FAVerified) return; // Prevent disabling without confirmation

    try {
      const res = await fetch(`http://localhost:5000/api/Users/${userId}/toggle-2fa`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Toggle failed');

      const updated = await res.json();
      const twoFA = Boolean(updated.isTwoFactorEnabled);
      setIsEnabled(twoFA);

      if (twoFA) {
        const genRes = await fetch(`http://localhost:5000/api/Users/${userId}/generate-2fa`, {
          method: 'POST',
        });
        if (!genRes.ok) throw new Error('QR gen failed');
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
      if (!isEnabled || !is2FAVerified) {
        alert('2FA is already disabled.');
        return;
      }

      const res = await fetch(`http://localhost:5000/api/Users/disable-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: disableCode }),
      });

      if (!res.ok) throw new Error('Disable verification failed');

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
      <div className="modal-content">
        <h2>Account Preferences</h2>

        {isLoading ? (
          <p>Loading 2FA status...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <p>Enable Two-Factor Authentication</p>
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
                <p style={{ fontSize: '0.7rem', color: '#777' }}>QR Visible ✅</p>
                <p>Manual code:</p>
                <code>{qrData.manualEntryKey}</code>
                <div className="verify-section">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button onClick={handleVerify}>Verify Code</button>
                </div>
              </div>
            )}

            {isEnabled && is2FAVerified && (
              <div className="disable-section">
                <p style={{ marginTop: '1rem', fontWeight: 500 }}>
                  Disable Two-Factor Authentication:
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                />
                <button onClick={handleDisable} style={{ backgroundColor: '#e74c3c' }}>
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
