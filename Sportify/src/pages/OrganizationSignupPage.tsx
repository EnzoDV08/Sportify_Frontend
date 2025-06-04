import { FC, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../Style/SignUp.css';
import SportifyLogo from '../assets/Icons/SportifyLogo.svg';

const OrganizationSignupPage: FC = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [contactPerson, setContactPerson] = useState('');
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
      const response = await fetch('http://localhost:5000/api/organizations/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: orgName,
          password: confirmPassword,
          website,
          contactPerson,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'organization');
        localStorage.setItem('organizationId', result.organizationId);

        showToast('Organization signup successful!', 'success');
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

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div id="toast-container" className="toast-container" />

        <div className="signup-image">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo" />
        </div>

        <div className="signup-form">
          <img src={SportifyLogo} alt="Sportify Logo" className="sportify-logo-mobile" />
          <h1>Welcome Organization!</h1>
          <h2>SIGN UP</h2>

          <form className="signup-inputs" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Organization Name"
              className="EmailInput"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="EmailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="inline-error">{emailError}</p>}

            <input
              type="text"
              placeholder="Website (optional)"
              className="EmailInput"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            <input
              type="text"
              placeholder="Contact Person"
              className="EmailInput"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />

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

            <button
              type="submit"
              className={`signup-btn ${loading ? 'login-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
        </form>
            <p className="SignUpButtonText">
                Want to register as a user instead?{' '}
                <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#dd8100' }}>
                    Click here
                </span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSignupPage;
