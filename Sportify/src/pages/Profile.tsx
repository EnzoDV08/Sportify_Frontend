import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import '../Style/Profile.css';

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
  selectedAchievement?: string; // 🏅 Make sure this exists
}

function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
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

        if (!userRes.ok || !profileRes.ok) throw new Error('Fetch failed');

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

    const fetchAllEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    fetchUserInfo();
    fetchAllEvents();
  }, []);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;

  return (
    <div className="profile-container">
<div className="profile-header">
  <div className="profile-info">
    <h1>{user?.name}</h1>
    <p><span className="label">Email:</span> {user?.email}</p>
    <p><span className="label">Favourite sport:</span> {profile?.favoriteSports}</p>
    <p><span className="label">Age:</span> {profile?.age}</p>
  </div>

  <div className="profile-about">
    <p className="label">Who Am I?</p>
    <p>{profile?.bio || 'No bio provided.'}</p>
  </div>

  <div className="profile-avatar">
<img src={`http://localhost:5000/${profile?.profilePicture}`} />
    <button className="edit-profile-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
  </div>
</div>

<div className="icons-bar">
  <span>⚽</span><span>🏀</span><span>🏋️‍♂️</span><span>🎯</span><span>🏕️</span><span>🏊</span>
</div>

<h2 className="section-title">Overall Stats</h2>
<div className="stats-wrapper">
  <div className="stats-container">
    <div className="stats-box"><span>Competed Events </span><span>8</span></div>
    <div className="stats-box"><span>Active Event Time </span><span>300h</span></div>
    <div className="stats-box"><span>First Places </span><span>3</span></div>
    <div className="stats-box"><span>Second Places </span><span>6</span></div>
    <div className="stats-box"><span>Third Places </span><span>4</span></div>
    <div className="stats-box"><span>Total Points </span><span>3059</span></div>
  </div>
</div>

    </div>
  );
}

export default Profile;
