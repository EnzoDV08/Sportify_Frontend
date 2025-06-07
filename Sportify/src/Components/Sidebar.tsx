import { useState, ReactNode, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaPlusCircle,
  FaTrophy,
  FaUsers,
  FaBell,
  FaCog,
  FaSearch,
  FaUserShield,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';
import '../Style/Sidebar.css';
import logo from '../assets/SportifyLogo.png';
import FriendSidebar from './FriendSidebar';


const Sidebar = () => {
  const [manuallyToggled, setManuallyToggled] = useState(false);
  const location = useLocation();
  const collapseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem('sidebarExpanded');
    return stored === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    setManuallyToggled(true);
    localStorage.setItem('sidebarExpanded', String(newState));
  };

  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendsSidebar, setShowFriendsSidebar] = useState(false);

  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName') || 'Guest';
  const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfileImage = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${baseUrl}/api/profile/${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.profilePicture) {
        setProfileImageUrl(`${baseUrl}/uploads/${data.profilePicture}`);
      }
    } catch (error) {
      console.error('Sidebar profile fetch error:', error);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setManuallyToggled(false);
    setUserId(id);
  }, []);

  useEffect(() => {
    if (userId) fetchProfileImage();
  }, [userId]);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  return (
    <div className="layout-container">
      <div
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => collapseTimeout.current && clearTimeout(collapseTimeout.current)}
        onMouseLeave={() => {
          if (manuallyToggled && isExpanded) {
            collapseTimeout.current = setTimeout(() => {
              setIsExpanded(false);
              setManuallyToggled(false);
              localStorage.setItem('sidebarExpanded', 'false');
            }, 500);
          }
        }}
      >
        <div className="top-section">
          <div className="logo-toggle">
            <img src={logo} alt="logo" className="logo-img" />
          </div>

          <div className="toggle-panel">
            <button onClick={toggleSidebar} className="toggle-btn">
              {isExpanded ? <FaAngleDoubleLeft size={22} /> : <FaAngleDoubleRight size={22} />}
            </button>
          </div>

          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search" className={`search-input ${isExpanded ? 'visible' : ''}`} />
          </div>

          <nav className="nav-links">
            <SidebarItem icon={<FaHome />} label="Home" isExpanded={isExpanded} to="/home" currentPath={location.pathname} />
            <SidebarItem icon={<FaCalendarAlt />} label="Events" isExpanded={isExpanded} to="/events" currentPath={location.pathname} />
            <SidebarItem icon={<FaPlusCircle />} label="Add Event" isExpanded={isExpanded} to="/add-event" currentPath={location.pathname} />
            <SidebarItem icon={<FaTrophy />} label="My Events" isExpanded={isExpanded} to="/my-events" currentPath={location.pathname} />
            <button onClick={() => setShowFriendsSidebar (prev => !prev)}className={`sidebar-item-wrapper ${showFriendsSidebar ? 'active' : ''}`}>
              <div className="item" data-tooltip="Friends">
                <span className="icon"><FaUsers /></span>
                {isExpanded && <span className="label">Friends</span>}
              </div>
            </button>
            {userType === 'admin' && ( 
            <SidebarItem icon={<FaUserShield />} label="Admin" isExpanded={isExpanded} to="/dashboard" currentPath={location.pathname} />)}
            <hr className="divider" />
            <div className={`dropdown-wrapper ${showNotifications ? 'open' : ''}`}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="item dropdown-toggle" data-tooltip="Notifications">
                <span className="icon"><FaBell /></span>
                {isExpanded && <><span className="label">Notifications</span><span className="dropdown-arrow">{showNotifications ? '▼' : '▶'}</span></>}
              </button>
              {showNotifications && isExpanded && (
                <div className="dropdown-menu">
                  <p className="dropdown-item">📬 New friend request</p>
                  <p className="dropdown-item">🏆 You earned a new achievement</p>
                  <p className="dropdown-item">📅 Event starts soon</p>
                  <Link to="/notifications" className="dropdown-item">📩 View Event Invites</Link>
                </div>
              )}
            </div>
            <div className={`dropdown-wrapper ${showSettings ? 'open' : ''}`}>
              <button onClick={() => setShowSettings(!showSettings)} className="item dropdown-toggle" data-tooltip="Settings">
                <span className="icon"><FaCog /></span>
                {isExpanded && <><span className="label">Settings</span><span className="dropdown-arrow">{showSettings ? '▼' : '▶'}</span></>}
              </button>
              {showSettings && isExpanded && (
                <div className="dropdown-menu">
                  <Link to="/settings" className="dropdown-item">⚙️ Account Preferences</Link>
                  <Link to="/change-password" className="dropdown-item">🔒 Change Password</Link>
                  <button onClick={handleSignOut} className="dropdown-item">🚪 Sign Out</button>
                </div>
              )}
            </div>
          </nav>
        </div>

<div className="profile" data-tooltip="View Profile">
  <img src={profileImageUrl || '/profile.jpg'} alt="profile" className="profile-img" />
  {isExpanded && (
    <div className="profile-info">
      <p className="name">{userName}</p>
      <p className="email">{userEmail}</p>
      <Link to="/profile">
        <button className="view-btn">View Profile</button>
      </Link>
    </div>
  )}
</div>
      </div>

<FriendSidebar
  className={showFriendsSidebar ? 'visible' : ''}
  onClose={() => setShowFriendsSidebar(false)}
/>



    </div>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isExpanded: boolean;
  to?: string;
  currentPath: string; // 🟢 add this
}


const SidebarItem = ({ icon, label, isExpanded, to, currentPath }: SidebarItemProps) => {
  const isActive = to && currentPath.startsWith(to); // 🟢 this marks the current page

  const content = (
    <div className={`sidebar-item-wrapper ${isActive ? 'active' : ''}`}>
      <div className={`item ${isActive ? 'active' : ''}`} data-tooltip={label}>
        <span className="icon">{icon}</span>
        {isExpanded && <span className="label">{label}</span>}
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <button className="sidebar-item-wrapper">{content}</button>;
};

export default Sidebar;
