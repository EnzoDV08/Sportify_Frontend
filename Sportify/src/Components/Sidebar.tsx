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
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaUserShield
} from 'react-icons/fa';
import '../Style/Sidebar.css';
import logo from '../assets/SportifyLogo.png';
import FriendSidebar from './FriendSidebar';
import AccountPreferencesModal from './AccountPreferencesModal';


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
  const [showAccountPrefs, setShowAccountPrefs] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [pendingJoinCount, setPendingJoinCount] = useState(0);
  const [inviteCount, setInviteCount] = useState(0);



  const userType = localStorage.getItem('userType');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [fullUser, setFullUser] = useState<{ name: string; email: string } | null>(null);



  const fetchProfileImage = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${baseUrl}/api/Profiles/${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.profilePicture) {
        setProfileImageUrl(`${baseUrl}/uploads/${data.profilePicture}`);
      }
    } catch (error) {
      console.error('Sidebar profile fetch error:', error);
    }
  };

  const fetchFullUserInfo = async () => {
  if (!userId) return;
  try {
    const [userRes, profileRes] = await Promise.all([
      fetch(`${baseUrl}/api/Users/${userId}`),
      fetch(`${baseUrl}/api/Profiles/${userId}`)
    ]);

    if (!userRes.ok || !profileRes.ok) throw new Error('Failed to fetch user/profile');

    const userData = await userRes.json();
    const profileData = await profileRes.json();

    setFullUser({ name: userData.name, email: userData.email });

    if (profileData.profilePicture) {
      setProfileImageUrl(`${baseUrl}/uploads/${profileData.profilePicture}`);
    }
  } catch (error) {
    console.error('Sidebar profile fetch error:', error);
  }
};


  useEffect(() => {
    const id = localStorage.getItem('userId');
    const fetchCounts = async () => {
      const invites = await fetch(`${baseUrl}/api/events/invites/${id}`);
const inviteData = await invites.json();
setInviteCount(inviteData.length);
  try {
    const [friendRes, joinRes] = await Promise.all([
      fetch(`${baseUrl}/api/friends/requests/${id}`),
      fetch(`${baseUrl}/api/events/requests/${id}`)
    ]);

    const friends = await friendRes.json();
    const joins = await joinRes.json();

    setFriendRequestCount(friends.length);
    setPendingJoinCount(joins.length);
  } catch (err) {
    console.error("❌ Error fetching counts", err);
  }
};
fetchCounts();
    setManuallyToggled(false);
    setUserId(id);
  }, []);

useEffect(() => {
  if (userId) {
    fetchProfileImage();      
    fetchFullUserInfo();    
  }
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
            <SidebarItem
  icon={
    <>
      <FaTrophy />
      {pendingJoinCount > 0 && <span className="badge">{pendingJoinCount}</span>}
    </>
  }
  label="My Events"
  isExpanded={isExpanded}
  to="/my-events"
  currentPath={location.pathname}
/>



            <button onClick={() => setShowFriendsSidebar(prev => !prev)} className={`sidebar-item-wrapper ${showFriendsSidebar ? 'active' : ''}`}>
  <div className="item" data-tooltip="Friends">
    <span className="icon">
      <FaUsers />
      {friendRequestCount > 0 && <span className="badge">{friendRequestCount}</span>}
    </span>
    {isExpanded && <span className="label">Friends</span>}
  </div>
</button>
           {userType === 'admin' && (
  <SidebarItem
  icon={<FaUserShield />}
  label="Admin Panel"
  isExpanded={isExpanded}
  to="/dashboard" // ✅ this matches the route in App.tsx
  currentPath={location.pathname}
/>
)}

            <hr className="divider" />
            <div className={`dropdown-wrapper ${showNotifications ? 'open' : ''}`}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="item dropdown-toggle" data-tooltip="Notifications">
<span className="icon">
  <FaBell />
  {(inviteCount > 0 || pendingJoinCount > 0 || friendRequestCount > 0) && (
    <span className="badge">
      {inviteCount + pendingJoinCount + friendRequestCount}
    </span>
  )}
</span>


                {isExpanded && <><span className="label">Notifications</span><span className="dropdown-arrow">
  {showNotifications ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
</span></>}
              </button>
{showNotifications && isExpanded && (
  <div className="dropdown-menu">
    <p className="dropdown-item">🏆 You earned a new achievement</p>
    <Link to="/notifications" className="dropdown-item">📩 View Event Invites</Link>
  </div>
)}
            </div>
            <div className={`dropdown-wrapper ${showSettings ? 'open' : ''}`}>
              <button onClick={() => setShowSettings(!showSettings)} className="item dropdown-toggle" data-tooltip="Settings">
                <span className="icon"><FaCog /></span>
                {isExpanded && <><span className="label">Settings</span><span className="dropdown-arrow">
  {showSettings ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
</span>
</>}
              </button>
              {showSettings && isExpanded && (
                <div className="dropdown-menu">
                  <button onClick={() => setShowAccountPrefs(true)} className="dropdown-item">⚙️ Account Preferences</button>
                  <Link to="/change-password" className="dropdown-item">🔒 Change Password</Link>
                </div>
              )}
            </div>
            <div className="sidebar-item-wrapper">
  <button onClick={handleSignOut} className="item" data-tooltip="Sign Out">
    <span className="icon"><FaSignOutAlt /></span>
    {isExpanded && <span className="label">Sign Out</span>}
  </button>
</div>
          </nav>
        </div>

<div className="profile" data-tooltip="View Profile">
  <img
    src={profileImageUrl || '/default-avatar.png'}
    alt="Profile"
    className="profile-img"
  />
  {isExpanded && (
    <div className="profile-info">
      <p className="name">{fullUser?.name || 'Loading...'}</p>
      <p className="email">{fullUser?.email}</p>
    </div>
  )}
</div>



      </div>

{showAccountPrefs && <AccountPreferencesModal onClose={() => setShowAccountPrefs(false)} />}


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
  currentPath: string; 
}


const SidebarItem = ({ icon, label, isExpanded, to, currentPath }: SidebarItemProps) => {
  const isActive = to && currentPath.startsWith(to); 

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
