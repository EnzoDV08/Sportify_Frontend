import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import '../Style/App.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="page-container">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
