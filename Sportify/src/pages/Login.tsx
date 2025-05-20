import { FC } from 'react';
import '../Style/Login.css';
import GoogleIcon from '../assets/Icons/Google.svg';

const LoginPage: FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image" />
        <div className="login-form">
          {/* Replace this with your actual form */}
          <h1>Welcome Back!</h1>
          <h2>LOG IN</h2>
          <div className="login-inputs">

            <input type="email" placeholder="Email" />

            <div className="PasswordCont">
              
              <input type="password" placeholder="Password" />

              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>


          </div>

          <div className="or-divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <button className="google-full-btn">
            <span>Login with Google</span>
            <img src={GoogleIcon} alt="Google login" />
          </button>
          
          <button className="login-btn">Login</button>
          <p className='SignUpButtonText'>Don't have an account? <a>Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
