import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/SignUp.css';
import { createUser } from '../services/api';

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.agreed) {
      alert('You must agree to the Terms and Privacy Policy.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await createUser({
        name: form.username,
        email: form.email,
        password: form.password
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "user");
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Failed to create user.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2 className="signup-title">CREATE ACCOUNT</h2>

      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="signup-input" required />
      <input type="text" name="username" placeholder="Username" onChange={handleChange} className="signup-input" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="signup-input" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="signup-input" required />

      <div className="signup-divider">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <button type="button" className="signup-google">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
        <span>Sign Up with Google</span>
      </button>

      <label className="signup-checkbox">
        <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} />
        <span>I agree with Term and Privacy Policy</span>
      </label>

      <button type="submit" className="signup-button">Sign Up</button>

      <div className="signup-company-box">
        <p className="signup-company-text">Are you a sports organisation?</p>
        <Link to="/auth/company-signup" className="signup-company-link">Register as a Partner</Link>
      </div>

      <p className="signup-login-text">
        Have an account? <Link to="/auth/login" className="signup-login-link">Log In</Link>
      </p>
    </form>
  );
}

export default SignUp;

