import { useState } from 'react';
import { ReactNode } from 'react';
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
} from 'react-icons/fa';
import '../Style/Sidebar.css';

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
          <img src="/logo.png" alt="logo" className="logo-img" />
          <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">☰</button>
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
          <div className="dropdown-wrapper">
            <button onClick={() => setShowNotifications(!showNotifications)} className="item">
              <span className="icon"><FaBell /></span>
              {isExpanded && <span>Notifications</span>}
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
          <div className="dropdown-wrapper">
            <button onClick={() => setShowSettings(!showSettings)} className="item">
              <span className="icon"><FaCog /></span>
              {isExpanded && <span>Settings</span>}
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

      <div className="profile">
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
    <div className="item">
      <span className="icon">{icon}</span>
      {isExpanded && <span>{label}</span>}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <button className="item">{content}</button>;
};

export default Sidebar;

