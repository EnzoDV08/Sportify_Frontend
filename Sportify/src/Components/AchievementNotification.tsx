// src/Components/AchievementNotification.tsx
import { useNotification } from '../context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import '../Style/AchievementNotification.css'; // 💡 Make sure this path matches your folder

const AchievementNotification = () => {
  const { notifications } = useNotification();

  return (
    <div className="achievement-container">
      <AnimatePresence>
        {notifications.map(({ id, title, message, iconUrl }) => (
          <motion.div
            key={id}
            className="achievement-popup"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {iconUrl && (
              <img
  src={iconUrl ? iconUrl : '/AdminLogo.png'}
  alt="icon"
  className="achievement-icon"
/>

            )}
            <div>
              <p className="achievement-title">{title}</p>
              <p className="achievement-message">{message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AchievementNotification;
