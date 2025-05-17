import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/Login.css';
import { loginUser } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trying login with:", form);

    try {
      const response = await loginUser(form.email, form.password);
      console.log("Login successful:", response);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', response.userType);
      localStorage.setItem('userId', response.userId); // optional

      if (response.userType === 'admin') navigate('/dashboard');
      else if (response.userType === 'company') navigate('/company-dashboard');
      else navigate('/home');
    } catch (error) {
      console.error("Login failed:", error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title">WELCOME BACK</h2>

      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="login-input" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="login-input" required />

      <button type="submit" className="login-button">Log In</button>

      <div className="login-divider">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <button type="button" className="login-google">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
        <span>Log In with Google</span>
      </button>

      <p className="login-register-text">
        Don't have an account? <Link to="/auth/signup" className="login-register-link">Sign Up</Link>
      </p>
    </form>
  );
}

export default Login;
