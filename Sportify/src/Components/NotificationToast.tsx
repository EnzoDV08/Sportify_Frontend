import { useNotification } from '../context/NotificationContext';
import '../Style/NotificationToast.css'; // you'll create this next

const NotificationToast = () => {
  const { notifications } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification-slide-in">
          <img src="/trophy.png" alt="Achievement" className="trophy-icon" />
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
