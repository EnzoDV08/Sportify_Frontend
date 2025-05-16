import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/CompanySignUp.css';
import { createCompany } from '../services/api';
import vectorImage from '../assets/Vector8.png';
import frameImage from '../assets/Frame12.png';
import backgroundImage from '../assets/background.png';

function CompanySignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    website: '',
    agreed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

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
      await createCompany({
        name: form.name,
        email: form.email,
        password: form.password,
        description: form.description,
        website: form.website
      });

      alert('Organization registered successfully!');
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Failed to register organization.');
    }
  };

  return (
    <div
      className="company-signup-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="company-signup-container">
        {/* Left image */}
        <div className="company-signup-image">
          <img src={vectorImage} alt="Vector" className="background-img" />
          <img src={frameImage} alt="Logo" className="logo-overlay" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="company-signup-form">
          <h2 className="signup-title">REGISTER ORGANIZATION</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Organization Name"
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="text"
            name="website"
            placeholder="Website URL"
            onChange={handleChange}
            className="signup-input"
          />

          <textarea
            name="description"
            placeholder="Short Description"
            onChange={handleChange}
            className="signup-input"
            rows={3}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="signup-input"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="signup-input"
            required
          />

          <label className="signup-checkbox">
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
            />
            <span>I agree with Term and Privacy Policy</span>
          </label>

          <button type="submit" className="signup-button">
            Register Organization
          </button>

          <p className="signup-login-text">
            Want to sign up as a regular user?{' '}
            <Link to="/signup" className="signup-login-link">
              Back to User Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CompanySignUp;

