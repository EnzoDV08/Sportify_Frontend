import { FC, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../Style/SignUp.css';

import SportifyLogo from '../assets/Icons/SportifyLogo.svg';

const SignupPage: FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setEmailError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      // 🔍 Step 1: Check for existing email
      const usersResponse = await fetch(`${baseUrl}/api/users`);
      const users = await usersResponse.json();
      const emailExists = users.some((user: any) => user.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        setEmailError('Email already exists');
        showToast('Email already exists', 'error');
        setLoading(false);
        return;
      }

      // ✅ Step 2: Create user
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: username,
          password: confirmPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', result.userType);
        localStorage.setItem('userId', result.userId);
        showToast('Signup successful!', 'success');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        const text = await response.text();
        showToast(text || 'Signup failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) {
      showToast('Google login failed: no token', 'error');
      return;
    }

    try {
      const response = await fetch('${API_BASE_URL}/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', result.userType);
        localStorage.setItem('userId', result.userId);
        showToast('Google signup successful!', 'success');
        setTimeout(() => navigate('/home'), 1500);
      } else {
        const text = await response.text();
        showToast(text || 'Google signup failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Google signup error.', 'error');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div id="toast-container" className="toast-container" />

        <div className="signup-image">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo" />
        </div>

        <div className="signup-form">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo-mobile" />
          <h1>Welcome!</h1>
          <h2>SIGN UP</h2>

          <form className="signup-inputs" onSubmit={handleSignup}>
            <div className="EmailCont">
              <input
                type="email"
                placeholder="Email"
                className="EmailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="inline-error">{emailError}</p>}
            </div>

            <div className="EmailCont">
              <input
                type="text"
                placeholder="Username"
                className="EmailInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            </div>

            <div className="PasswordCont">
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && <p className="inline-error">{passwordError}</p>}
            </div>

            <div className="SignupButtonCont">
              <button
                type="submit"
                className={`signup-btn ${loading ? 'login-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>

              <p className="SignUpButtonText">
                Already have an account?{' '}
                <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#dd8100' }}>
                  Log in
                </span>
              </p>
            </div>

            <div className="or-divider">
              <hr />
              <span>OR</span>
              <hr />
            </div>

            <div className="google-full-btn">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => showToast('Google sign-in failed.', 'error')}
              />
            </div>
          </form>

          <p className="SignUpButtonText">
            Want to register as an organization?{' '}
            <span onClick={() => navigate('/org-signup')} style={{ cursor: 'pointer', color: '#dd8100' }}>
              Click here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
