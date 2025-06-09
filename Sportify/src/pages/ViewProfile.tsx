import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
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
  selectedAchievement?: string;
  totalPoints?: number;
}

interface UserAchievement {
  userAchievementId: number;
  userId: number;
  achievementId: number;
  eventId?: number;
  dateAwarded: string;
}

interface Achievement {
  achievementId: number;
  title: string;
  description: string;
  sportType: string;
  iconUrl: string;
  points: number;
}

function ViewProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!id) return;

    const fetchUserInfo = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/Users/${id}`),
          fetch(`${API_BASE_URL}/api/Profiles/${id}`)
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

    const fetchAllData = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);

        const shuffled = [...eventsData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setUpcomingEvents(selected);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    const fetchAchievements = async () => {
      try {
        const [userAchRes, allAchRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/UserAchievements/user/${id}`),
          fetch(`${API_BASE_URL}/api/Achievements`)
        ]);

        if (!userAchRes.ok || !allAchRes.ok) throw new Error("Fetch failed");

        const userAch = await userAchRes.json();
        const allAch = await allAchRes.json();

        setUserAchievements(userAch);
        setAllAchievements(allAch);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      }
    };

    fetchUserInfo();
    fetchAllData();
    fetchAchievements();
  }, [id]);

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
      <h1 className="profile-title">{user?.name ? `${user.name}'s Profile` : 'Profile'}</h1>
      <div className="profile-header">
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p><span className="label">Email:</span> {user?.email}</p>
          <p><span className="label">Favourite sport:</span> {profile?.favoriteSports}</p>
          <p><span className="label">Age:</span> {profile?.age}</p>
          <p><span className="label-points">Total Points:</span> {profile?.totalPoints}</p>
        </div>

        <div className="profile-about">
          <p className="label">Who Am I?</p>
          <p>{profile?.bio || 'No bio provided.'}</p>
        </div>

        <div className="profile-avatar">
          <img
            src={
              profile?.profilePicture
                ? profile.profilePicture.startsWith('http')
                  ? profile.profilePicture
                  : `${API_BASE_URL}${profile.profilePicture}`
                : '/default-profile.png'
            }
            alt="Profile"
            className="profile-picture"
          />
        </div>
      </div>

      <h2 className="section-title">Achievements</h2>
      <div className="profile-events-row">
        {userAchievements.map((ua) => {
          const achievement = allAchievements.find(
            (a) => Number(a.achievementId) === Number(ua.achievementId)
          );
          if (!achievement) {
            console.warn('❌ Achievement not found for ID:', ua.achievementId);
            return null;
          }

          return (
            <div key={ua.achievementId} className="achievement-card">
              <img src={achievement.iconUrl} alt={achievement.title} className="achievement-icon" />
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <small>{achievement.sportType} • {achievement.points} pts</small>
              </div>
            </div>
          );
        })}
        {userAchievements.length === 0 && (
          <p>No achievements yet — get active!</p>
        )}
      </div>

      <h2 className="section-title">Events You Might Like</h2>
      <div className="profile-events-row">
        {upcomingEvents.map((event) => (
          <div key={event.eventId} className="event-card-week">
            <div className="event-banner">
              <img
                src={event.imageUrl || '/fallback.jpg'}
                alt={event.title}
                className="event-image"
              />
            </div>
            <div className="profile-event-details">
              <h3>{event.title}</h3>
              <p><FaClock /> {formatDate(event.startDateTime)}</p>
              <p><FaMapMarkerAlt /> {event.location}</p>
              <Link to={`/events/${event.eventId}`} className="view-event-btn">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewProfile;
