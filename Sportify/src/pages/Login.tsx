import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';
import GoogleIcon from '../assets/Icons/Google.svg';

const LoginPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'alert alert-success w-fit px-4 py-2 text-white bg-green-500 shadow-lg';
    toast.innerText = message;

    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000); // 3 seconds
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        showToast('Login successful!');
        setTimeout(() => navigate('/events'), 1500);
      } else {
        showToast('Incorrect email or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showToast('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* Toast Container */}
      <div id="toast-container" className="toast toast-bottom toast-end fixed z-50" />

      <div className="login-container">
        <div className="login-image" />
        <div className="login-form">
          <h1>Welcome Back!</h1>
          <h2>LOG IN</h2>
          <form onSubmit={handleLogin} className="login-inputs">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="PasswordCont">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="or-divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <button className="google-full-btn" type="button">
            <span>Login with Google</span>
            <img src={GoogleIcon} alt="Google login" />
          </button>

          <p className="SignUpButtonText">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
