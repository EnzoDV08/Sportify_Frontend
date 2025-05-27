import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Profile.css';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';

import image48 from '../assets/image 48.png';
import image33 from '../assets/image 33.png';
import image49 from '../assets/image 49.png';

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
      <h2 className="section-title">Events won</h2>
      <div className="events-won-section">
        {/* Recent Events */}
        {recentEvents.map((event, idx) => (
          <div className="event-card" key={idx}>
            <div className="event-image-container">
              <img src={event.imageUrl || '/images/placeholder-event.jpg'} alt={event.title} className="event-image" />
              <span className="event-status">Ended</span>
            </div>
            <div className="event-details">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-type">{event.type || "Public"}</span>
              </div>
              <p className="event-description">{event.description || "No description provided."}</p>
              <div className="event-meta">
                <div className="meta-info">
                  <div className="event-date"><span>🗓</span> {new Date(event.endDateTime).toLocaleDateString()}</div>
                  <div className="event-location"><span>📍</span> {event.location}</div>
                </div>
                <div className="vertical-divider"></div>
                <div className="event-tags">
                  <span>🏟 {event.visibility}</span><span>🔥 Active</span><span>🎉 Fun</span>
                </div>
                <div className="event-host">
                  <span>#1</span>
                  <img src="/images/profile.jpg" alt="host" className="host-img" />
                  <span className="host-name">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
