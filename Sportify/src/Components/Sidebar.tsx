import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
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

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userType = localStorage.getItem("userType");

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="top-section">
        <div className="logo-toggle">
          <img src={logo} alt="logo" className="logo-img" />
        </div>

        <div className="toggle-panel">
          <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">
            {isExpanded ? <FaAngleDoubleLeft size={22} /> : <FaAngleDoubleRight size={22} />}
          </button>
        </div>
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className={`search-input ${isExpanded ? 'visible' : ''}`}
          />
        </div>

        <nav className="nav-links">
          <SidebarItem icon={<FaHome />} label="Home" isExpanded={isExpanded} to="/home" />
          <SidebarItem icon={<FaCalendarAlt />} label="Events" isExpanded={isExpanded} to="/events" />
          <SidebarItem icon={<FaPlusCircle />} label="Add Event" isExpanded={isExpanded} to="/add-event" />
          <SidebarItem icon={<FaTrophy />} label="My Events" isExpanded={isExpanded} to="/my-events" />
          <SidebarItem icon={<FaUsers />} label="Friends" isExpanded={isExpanded} to="/friends" />
          {userType === "admin" && (
            <SidebarItem icon={<FaUserShield />} label="Admin" isExpanded={isExpanded} to="/dashboard" />
          )}
          <hr className="divider" />

          {/* Notifications */}
          <div className={`dropdown-wrapper ${showNotifications ? 'open' : ''}`}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="item dropdown-toggle"
              data-tooltip="Notifications"
            >
              <span className="icon"><FaBell /></span>
              {isExpanded && (
                <>
                  <span className="label">Notifications</span>
                  <span className="dropdown-arrow">{showNotifications ? '▼' : '▶'}</span>
                </>
              )}
            </button>
            {showNotifications && isExpanded && (
              <div className="dropdown-menu">
                <p className="dropdown-item">📬 New friend request</p>
                <p className="dropdown-item">🏆 You earned a new achievement</p>
                <p className="dropdown-item">📅 Event starts soon</p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className={`dropdown-wrapper ${showSettings ? 'open' : ''}`}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="item dropdown-toggle"
              data-tooltip="Settings"
            >
              <span className="icon"><FaCog /></span>
              {isExpanded && (
                <>
                  <span className="label">Settings</span>
                  <span className="dropdown-arrow">{showSettings ? '▼' : '▶'}</span>
                </>
              )}
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
        <img src="/profile.jpg" alt="profile" className="profile-img" />
        {isExpanded && (
          <div className="profile-info">
            <p className="name">Pieter Man</p>
            <p className="email">pieterDieMan@gmail.com</p>
            <button className="view-btn">View Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isExpanded: boolean;
  to?: string;
}

const SidebarItem = ({ icon, label, isExpanded, to }: SidebarItemProps) => {
  const content = (
    <div className="sidebar-item-wrapper">
      <div className="item" data-tooltip={label}>
        <span className="icon">{icon}</span>
        {isExpanded && <span className="label">{label}</span>}
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : <button className="sidebar-item-wrapper">{content}</button>;
};

export default Sidebar;

