import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Profile.css';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaSearch
} from 'react-icons/fa';

interface UserData {
  name: string;
  email: string;
}

interface UserProfile {
  userId: number;
  profilePicture?: string;
  location?: string;
  interests?: string;
  favoriteSports?: string;
  availability?: string;
  bio?: string;
  phoneNumber?: string;
  socialMediaLink?: string;
  gender?: string;
  age?: number;
}

function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No userId in localStorage');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch(`http://localhost:5000/api/Users/${userId}`),
          fetch(`http://localhost:5000/api/Profiles/${userId}`)
        ]);

        if (!userRes.ok || !profileRes.ok) {
          throw new Error('Failed to fetch user or profile info');
        }

        const userData = await userRes.json();
        const profileData = await profileRes.json();

        setUser({ name: userData.name, email: userData.email });
        setProfile(profileData);
      } catch (err) {
        console.error('Error loading user/profile:', err);
      } finally {
        setLoading(false);
      }
    };

    const loadRecentEndedEvents = async () => {
      try {
        const allEndedEvents = await fetchEvents();
        const sorted = allEndedEvents
          .filter(e => new Date(e.endDateTime) < new Date())
          .sort((a, b) => new Date(b.endDateTime).getTime() - new Date(a.endDateTime).getTime())
          .slice(0, 3);
        setRecentEvents(sorted);
      } catch (err) {
        console.error('Failed to load recent ended events:', err);
      }
    };

    const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

    fetchUserInfo();
    loadRecentEndedEvents();
  }, []);

  if (loading) return <div className="profile-container">Loading profile...</div>;

  return (
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-info">
            <h1>{user?.name || 'Unknown User'}</h1>
            <p><span className="label">Email:</span> {user?.email || 'N/A'}</p>
            <p><span className="label">Location:</span> {profile?.location || 'N/A'}</p>
            <p><span className="label">Favourite sport:</span> {profile?.favoriteSports || 'N/A'}</p>
            <p><span className="label">Age:</span> {profile?.age || 'N/A'}</p>
            <p><span className="label">Gender:</span> {profile?.gender || 'N/A'}</p>
          </div>
          <div className="profile-about">
            <p className="about-heading">Who Am I?</p>
            <p>{profile?.bio || "No bio provided."}</p>
          </div>
          <div className="profile-avatar">
            <img src={profile?.profilePicture || "/placeholder-profile.jpg"} alt="Profile" />
          <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>

          </div>
        </div>

        {/* Icons */}
        <div className="profile-icons">
          <div className="icons-bar">
            <span>🏀</span><span>🏓</span><span>⛳</span><span>🛏️</span><span>🧪</span>
          </div>
          <p className="view-all">View all</p>
        </div>

        {/* Stats */}
        <h2 className="section-title">Overall Stats</h2>
        <div className="stats-wrapper">
          <div className="stats-container">
            <div className="stats-box"><span>Competed Events</span><span>8</span></div>
            <div className="stats-box"><span>Active Event Time</span><span>300h</span></div>
            <div className="stats-box"><span>First Places</span><span>3</span></div>
            <div className="stats-box"><span>Second Places</span><span>6</span></div>
            <div className="stats-box"><span>Third Places</span><span>4</span></div>
            <div className="stats-box"><span>Total Points</span><span>3059</span></div>
          </div>
        </div>

        {/* Events won */}
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-won-section">
          {/* Recent Events */}
  {recentEvents.map((event, idx) => (
  <div className="event-card" key={event.eventId}>
    <div className="event-banner">
      <img src={event.imageUrl ?? '/fallback.jpg'} alt={event.title} className="event-image" />
      <div className="host-badge">
        <img src="/placeholder-profile.jpg" alt="host" />
        <span>HOSTED BY BEARDED</span> {/* Replace with actual host logic if available */}
      </div>
      <div className="status-badge">Starting Soon</div>
    </div>

    <div className="profile-event-details">
      <h3>{event.title}</h3>
      <div className="profile-event-meta">
        <div>
          <i className="fa fa-clock-o" /> {new Date(event.startDateTime).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div>
          <i className="fa fa-map-marker" /> {event.location}
        </div>
      </div>

      <div className="profile-event-buttons">
        <span className="profile-event-type">{event.visibility?.toUpperCase()}</span>
        <button className="profile-view-btn">View</button>
      </div>
    </div>
  </div>

))}
</div>
</div>
  );
}

export default Profile;
