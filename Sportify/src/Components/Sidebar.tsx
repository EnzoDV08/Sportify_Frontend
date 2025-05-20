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

  return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="top-section">
            <div className="logo-toggle">
            <img src="/logo.png" alt="logo" className="logo-img" />
            <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-btn">☰</button>
            </div>

            {/* Always show the search icon */}
            <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Search"
                className={`search-input ${isExpanded ? 'visible' : ''}`}
            />
            </div>

            <nav className="nav-links">
            <SidebarItem icon={<FaHome />} label="Home" isExpanded={isExpanded} to="/" />
            <SidebarItem icon={<FaCalendarAlt />} label="Events" isExpanded={isExpanded} to="/events" />
            <SidebarItem icon={<FaPlusCircle />} label="Add Event" isExpanded={isExpanded} to="/add-event" />
            <SidebarItem icon={<FaTrophy />} label="My Events" isExpanded={isExpanded} to="/my-events" />
            <SidebarItem icon={<FaUsers />} label="Friends" isExpanded={isExpanded} to="/friends" />
            <SidebarItem icon={<FaUserShield />} label="Admin" isExpanded={isExpanded} to="/dashboard" />
            <hr className="divider" />
            <SidebarItem icon={<FaBell />} label="Notifications" isExpanded={isExpanded} to="/notifications" />
            <SidebarItem icon={<FaCog />} label="Settings" isExpanded={isExpanded} to="/settings" />
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