import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import AchievementNotification from '../Components/AchievementNotification';
import '../Style/App.css';


const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="page-container">
        <Outlet />
        <AchievementNotification /> {/* 👈 Notification always on page */}
      </div>
    </div>
  );
};


export default MainLayout;
