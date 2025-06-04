import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Style/Login.css';
import GoogleIcon from '../assets/Icons/Google.svg';
import SportifyLogo from '../assets/Icons/SportifyLogo.svg';

const LoginPage: FC = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', userResult.userType);
      localStorage.setItem('userId', userResult.userId);

      showToast('Login successful!', 'success');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error('Login failed:', err);
      showToast('An error occurred. Please try again.', 'error');
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
                <a href="#" className="forgot-password">Forgot Password?</a>
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

            <button className="google-full-btn" type="button">
              <span>Login with Google</span>
              <img src={GoogleIcon} alt="Google login" />
            </button>
          </form>

          <p className="SignUpButtonText">
            Don't have an account? <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#dd8100' }}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;