import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import backgroundImage from '../assets/background.png';
import vectorImage from '../assets/Vector8.png';
import frameImage from '../assets/Frame12.png';
import '../Style/AuthLayout.css';

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div
      className="auth-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="auth-container">
        {/* Static left image */}
        <div className="auth-image">
          <img src={vectorImage} alt="Vector" className="background-img" />
          <img src={frameImage} alt="Logo" className="logo-overlay" />
        </div>

        {/* Animated form side */}
        <div className="auth-form">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="auth-form-inner"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;


