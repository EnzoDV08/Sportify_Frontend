import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import '../Style/Login.css';
import '../Style/ForgotPasswordModal.css';
import SportifyLogo from '../assets/Icons/SportifyLogo.svg';

const LoginPage: FC = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [canReset, setCanReset] = useState(false);


  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerText = message;

    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const baseUrl = 'http://localhost:5000';

      // Try logging in as a regular user first
      let response = await fetch(`${baseUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // If user login fails, try organization login
      if (!response.ok) {
        response = await fetch(`${baseUrl}/api/organizations/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          showToast(errorText || 'Login failed.', 'error');
          setError(errorText);
          return;
        }

        // ✅ Org login success
        const orgResult = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'organization');
        localStorage.setItem('userId', orgResult.organizationId);

        showToast('Organization login successful!', 'success');
        setTimeout(() => navigate('/home'), 1500);
        return;
      }

      // ✅ User login success
      const userResult = await response.json();
      console.log('🔍 userResult:', userResult);
      if (userResult.isTwoFactorEnabled) {
        console.log('🛡️ 2FA required for User ID:', userResult.userId);
        setPendingUserId(userResult.userId); // ✅ Now it's being used
        setShow2FAModal(true);
        return;
      } else {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userResult.userType);
        localStorage.setItem('userId', userResult.userId);

        showToast('Login successful!', 'success');
        setTimeout(() => navigate('/home'), 1500);
      }

    } catch (err) {
      console.error('Login failed:', err);
      showToast('An error occurred. Please try again.', 'error');
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async () => {
    if (!pendingUserId) return;

    const baseUrl = 'http://localhost:5000';
    try {
      const response = await fetch(`${baseUrl}/api/users/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pendingUserId, code: verificationCode }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        showToast(errorMsg || 'Invalid verification code.', 'error');
        return;
      }

      const result = await response.json();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', result.userType);
      localStorage.setItem('userId', result.userId);

      showToast('Login successful!', 'success');
      setShow2FAModal(false);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      showToast('Verification failed. Please try again.', 'error');
      console.error('2FA error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div id="toast-container" className="toast-container" />

        <div className="login-image">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo" />
        </div>

        <div className="login-form">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo-mobile" />

          <h1>Welcome Back!</h1>
          <h2>LOG IN</h2>

          <form onSubmit={handleLogin} className="login-inputs">
            <div className="EmailCont">
              <input
                type="email"
                placeholder="Email"
                className="EmailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="PasswordCont">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="password-row">
                {error && <p className="inline-error">{error}</p>}
                <a onClick={() => setShowForgotPasswordModal(true)} className="forgot-password">
                  Forgot Password?
                </a>

              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${loading ? 'login-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="or-divider">
              <hr />
              <span>OR</span>
              <hr />
            </div>

            <div className="google-full-btn">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  if (!credentialResponse.credential) {
                    showToast('Missing Google token.', 'error');
                    return;
                  }

                  const token = credentialResponse.credential;
                  const baseUrl = 'http://localhost:5000';

                  const res = await fetch(`${baseUrl}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                  });

                  if (!res.ok) {
                    const text = await res.text();
                    showToast(text || 'Google login failed.', 'error');
                    return;
                  }

                  const user = await res.json();

                  if (user.isTwoFactorEnabled) {
                    console.log('🛡️ 2FA required for Google login, userId:', user.userId);
                    setPendingUserId(user.userId);
                    setShow2FAModal(true);
                    return;
                  }

                  localStorage.setItem('isLoggedIn', 'true');
                  localStorage.setItem('userType', user.userType);
                  localStorage.setItem('userId', user.userId);

                  showToast('Google login successful!', 'success');
                  setTimeout(() => navigate('/home'), 1500);
                } catch (err) {
                  console.error('Google login error', err);
                  showToast('Google login error.', 'error');
                }
              }}
              onError={() => showToast('Google login failed.', 'error')}
              useOneTap={false}
            />
            </div>
          </form>

          <p className="SignUpButtonText">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#dd8100' }}>
              Sign up
            </span>
          </p>
        </div>
      </div>

      {show2FAModal && (
        <div className="modal-overlay">
          <div className="modal-content twofa-modal">
            <h2 className="modal-heading">ENTER 2FA CODE</h2>
            <p className="modal-subheading">Enter your 6-digit code from your authenticator app</p>

            <div className="code-input-wrapper">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="code-box"
                  value={verificationCode[index] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, '');
                    if (!val) return;

                    const newCode = verificationCode.split('');
                    newCode[index] = val;
                    setVerificationCode(newCode.join(''));

                    const next = document.getElementById(`code-${index + 1}`);
                    if (next) (next as HTMLInputElement).focus();
                  }}
                  onKeyDown={(e) => {
                    const prev = document.getElementById(`code-${index - 1}`);
                    const next = document.getElementById(`code-${index + 1}`);

                    if (e.key === 'Backspace') {
                      e.preventDefault();
                      const newCode = verificationCode.split('');
                      newCode[index] = '';
                      setVerificationCode(newCode.join(''));

                      if (index > 0 && prev) (prev as HTMLInputElement).focus();
                    } else if (e.key === 'ArrowLeft' && prev) {
                      e.preventDefault();
                      (prev as HTMLInputElement).focus();
                    } else if (e.key === 'ArrowRight' && next) {
                      e.preventDefault();
                      (next as HTMLInputElement).focus();
                    } else if (e.key === 'Enter' && verificationCode.length === 6) {
                      handle2FAVerification();
                    }
                  }}
                />
              ))}
            </div>

            <button
              onClick={handle2FAVerification}
              className="login-btn"
              style={{ marginTop: '1.5rem' }}
              disabled={verificationCode.length !== 6}
            >
              Verify
            </button>

            <button
              onClick={() => setShow2FAModal(false)}
              className="modal-back"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}

      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="forgot-modal">
            <h2 className="modal-heading">RESET PASSWORD</h2>

            {!resetUserId ? (
              <>
                <p>Enter your email to begin:</p>
                <input
                  type="email"
                  className="EmailInput"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button
                  className="login-btn"
                  style={{ marginTop: '1rem' }}
                  onClick={async () => {
                    const res = await fetch(`http://localhost:5000/api/users/email/${resetEmail}`);
                    if (!res.ok) {
                      showToast('User not found', 'error');
                      return;
                    }
                    const user = await res.json();
                    if (!user.isTwoFactorEnabled) {
                      showToast('Two-step verification is not enabled.', 'error');
                      return;
                    }
                    setResetUserId(user.userId);
                    showToast('2FA enabled. Enter verification code.', 'success');
                  }}
                >
                  Next
                </button>
              </>
            ) : !canReset ? (
              <>
                <p>Enter your 6-digit 2FA code:</p>
                <div className="code-input-wrapper1">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      id={`reset-code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="code-box"
                      value={resetCode[index] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, '');
                        if (!val) return;

                        const newCode = resetCode.split('');
                        newCode[index] = val;
                        setResetCode(newCode.join(''));

                        const next = document.getElementById(`reset-code-${index + 1}`);
                        if (next) (next as HTMLInputElement).focus();
                      }}
                      onKeyDown={(e) => {
                        const prev = document.getElementById(`reset-code-${index - 1}`);
                        const next = document.getElementById(`reset-code-${index + 1}`);

                        if (e.key === 'Backspace') {
                          e.preventDefault();
                          const newCode = resetCode.split('');
                          newCode[index] = '';
                          setResetCode(newCode.join(''));

                          if (index > 0 && prev) (prev as HTMLInputElement).focus();
                        } else if (e.key === 'ArrowLeft' && prev) {
                          e.preventDefault();
                          (prev as HTMLInputElement).focus();
                        } else if (e.key === 'ArrowRight' && next) {
                          e.preventDefault();
                          (next as HTMLInputElement).focus();
                        } else if (e.key === 'Enter' && resetCode.length === 6) {
                          // Optionally trigger submit
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
                      body: JSON.stringify({ userId: resetUserId, code: resetCode }),
                    });
                    if (!res.ok) {
                      showToast('Invalid code', 'error');
                      return;
                    }
                    setCanReset(true);
                    showToast('Code verified. Enter new password.', 'success');
                  }}
                >
                  Verify
                </button>
              </>
            ) : (
              <>
                <p>Enter new password:</p>
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
                    const res = await fetch(`http://localhost:5000/api/users/${resetUserId}/reset-password`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ newPassword }),
                    });
                    if (!res.ok) {
                      showToast('Failed to reset password', 'error');
                      return;
                    }
                    showToast('Password updated!', 'success');
                    setShowForgotPasswordModal(false);
                  }}
                >
                  Save
                </button>
              </>
            )}

            <button
              className="modal-back"
              onClick={() => setShowForgotPasswordModal(false)}
            >
              ← Cancel
            </button>
          </div>
        </div>
      )}




    </div>
  );
};

export default LoginPage;
