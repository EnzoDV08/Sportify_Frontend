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
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

if (response.ok) {
  const result = await response.json();

  // ✅ Store login info
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userType', result.userType);
  localStorage.setItem('userId', result.userId);

  // ✅ ADD these two lines below:
  localStorage.setItem('userName', result.name);    // 👈 Comes from backend
  localStorage.setItem('userEmail', result.email);  // 👈 Comes from backend

  showToast('Login successful!', 'success');
  setTimeout(() => navigate('/home'), 1500);
}
 else {
      // 🔽 Start of improved error handling
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Login failed.';

      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const text = await response.text();
        console.warn('Received non-JSON response:', text);
        errorMessage = text.includes('HTTP') ? 'Server error. Please try again.' : text;
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  } catch (err) {
    console.error('Login failed:', err);
    setError('An error occurred. Please try again.');
    showToast('An error occurred. Please try again.', 'error');
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