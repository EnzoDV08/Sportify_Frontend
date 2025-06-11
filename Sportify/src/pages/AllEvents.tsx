import { useEffect, useState } from 'react';
import { fetchEvents, fetchUserById, fetchProfile } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaSearch,
  FaCalendarAlt,
  FaFolder
} from 'react-icons/fa';
import '../Style/AllEvents.css';
import bgWhite from '../assets/Slide 16_9 - 5.png';
import { Circles } from 'react-loader-spinner';

interface CreatorInfo {
  username: string;
  profilePicture: string;
}

const resolveImageUrl = (path: string | undefined | null): string => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!path) return '/avatar.png';
  if (path.startsWith('http')) return path;
  if (path.includes('/uploads')) return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  return `${base}/uploads/${path}`;
};

function isThisWeekAndNotEnded(start: string, end: string): boolean {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return startDate >= startOfWeek && startDate <= endOfWeek && endDate >= now;
}

function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [creatorMap, setCreatorMap] = useState<Record<number, CreatorInfo>>({});
  const [participantProfileMap, setParticipantProfileMap] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchEvents()
      .then(async (data) => {
        setEvents(data);
        setFilteredEvents(data);

        const uniqueIds = [...new Set(data.map(e => e.creatorUserId))];
        const userMap: Record<number, CreatorInfo> = {};

        await Promise.all(uniqueIds.map(async (id) => {
          try {
            const user = await fetchUserById(id);
            const profile = await fetchProfile(id);
            userMap[id] = {
              username: user.username ?? user.name ?? 'Unknown',
              profilePicture: resolveImageUrl(profile?.profilePicture),
            };
          } catch {
            userMap[id] = {
              username: 'Unknown',
              profilePicture: '/avatar.png'
            };
          }
        }));

        setCreatorMap(userMap);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const results = events.filter(e =>
      e.title.toLowerCase().includes(lower) ||
      e.location.toLowerCase().includes(lower)
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  useEffect(() => {
    const loadParticipantProfiles = async () => {
      const allParticipantIds = new Set<number>();

      filteredEvents.forEach(event => {
        event.participants?.forEach(p => allParticipantIds.add(p.userId));
      });

      const profileMap: Record<number, string> = {};

      await Promise.all(
        Array.from(allParticipantIds).map(async id => {
          try {
            const profile = await fetchProfile(id);
            profileMap[id] = resolveImageUrl(profile?.profilePicture);
          } catch {
            profileMap[id] = '/avatar.png';
          }
        })
      );

      setParticipantProfileMap(profileMap);
    };

    if (filteredEvents.length > 0) {
      loadParticipantProfiles();
    }
  }, [filteredEvents]);

  const now = new Date();
  const thisWeekEvents = filteredEvents.filter(event => isThisWeekAndNotEnded(event.startDateTime, event.endDateTime));
  const upcomingEvents = filteredEvents.filter(e => new Date(e.startDateTime) >= now).sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  const pastEvents = filteredEvents.filter(e => new Date(e.startDateTime) < now).sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());
  const displayedEvents = view === 'upcoming' ? upcomingEvents : pastEvents;

  const getStatusBadge = (start: string, end: string): { label: string, className: string } | null => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const isToday = now.toDateString() === startDate.toDateString();

    if (now >= startDate && now <= endDate) return { label: 'Started', className: 'status-started' };
    if (isToday && now < startDate) return { label: 'Starting Soon', className: 'status-starting' };
    return { label: 'Upcoming', className: 'status-upcoming' };
  };

  if (loading) {
    return (
      <div className="all-events-page event-loading-container">
        <Circles height="80" width="80" color="#ff9100" ariaLabel="loading-events" />
        <p className="loading-message">Loading... because good things take time.</p>
      </div>
    );
  }

  return (
    <div className="sportify-events-page">
      <div className="all-events-page">
        <div className="events-section-white" style={{ backgroundImage: `url(${bgWhite})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '65vh' }}>
          <div className="event-header">
            <div className="event-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="event-input" />
            </div>
          </div>
          <div className="section-divider"></div>
          <div className="events-grid">
            <div className="main-column">
              <h2 className="section-subtitle">EVENTS THIS WEEK</h2>
              <div className="week-events">
                {thisWeekEvents.length > 0 ? thisWeekEvents.map((event) => {
                  const start = new Date(event.startDateTime);
                  const formattedStart = start.toLocaleString('default', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                  const creator = creatorMap[event.creatorUserId];
                  const badge = getStatusBadge(event.startDateTime, event.endDateTime);

                  return (
                    <div key={event.eventId} className="event-card-week">
                      <div className="event-img-container">
                        <div className="hosted-badge">
                          <img src={creator?.profilePicture || '/avatar.png'} alt="Host" className="hosted-avatar" />
                          <span className="hosted-text">HOSTED BY {creator?.username?.toUpperCase() || 'UNKNOWN'}</span>
                        </div>
                        {badge && <div className={`event-status ${badge.className}`}>{badge.label}</div>}
                        <img src={event.imageUrl || '/placeholder.jpg'} alt="Event" className="event-img" />
                      </div>
                      <div className="all-event-body">
                        <h3 className="week-event-title">{event.title}</h3>
                        <p className="event-meta"><FaClock className="event-icon" /> {formattedStart}</p>
                        <p className="event-meta"><FaMapMarkerAlt className="event-icon" /> {event.location}</p>
                      </div>
                      <div className="event-footer">
                        <span className="week-event-visibility">{event.visibility?.toUpperCase() || 'PUBLIC'}</span>
                        <Link to={`/events/${event.eventId}`} className="event-week-view-btn">View</Link>
                      </div>
                    </div>
                  );
                }) : <h6>No events this week.</h6>}
              </div>
            </div>
          </div>
        </div>

        <div className="button-toggle-wrapper">
          <button className={`btn-toggle ${view === 'upcoming' ? 'active' : ''}`} onClick={() => setView('upcoming')}><FaCalendarAlt /> Create Event</button>
          <button className={`btn-toggle ${view === 'past' ? 'active-dark' : ''}`} onClick={() => setView('past')}><FaFolder /> Past Events</button>
        </div>

        <h1 className="event-section-title">{view === 'upcoming' ? 'Upcoming Events' : 'Past Events'}</h1>
        <div className="upcoming-events">
          {displayedEvents.map((event) => {
            const start = new Date(event.startDateTime);
            const end = new Date(event.endDateTime);
            const month = start.toLocaleString('default', { month: 'long' });
            const day = start.getDate();
            const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const creator = creatorMap[event.creatorUserId];
            const participantCount = event.participants?.length || 0;

            return (
              <div key={event.eventId} className="event-card-upcoming">
                <div className="event-img-upcoming">
                  <img src={event.imageUrl || '/placeholder.jpg'} alt="Event" className="event-img" />
                </div>
                <div className="event-details-upcoming">
                  <div className="event-title-row">
                    <h2 className="event-title">{event.title}</h2>
                    <span className={`event-visibility ${event.visibility?.toLowerCase()}`}>{event.visibility?.toUpperCase() || 'PUBLIC'}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-location"><FaMapMarkerAlt className="all-event-icon" /> {event.location}</div>
                  <div className="hosted-info">
                    <img src={creator?.profilePicture} alt="Host" className="hosted-avatar" />
                    <span className="hosted-by">HOSTED BY {creator?.username?.toUpperCase() || 'UNKNOWN'}</span>
                  </div>
                  {participantCount > 0 ? (
                    <div className="avatar-stack">
                      <div className="avatars">
                        {(event.participants ?? []).slice(0, 3).map((user, index) => (
                          <img key={user.userId || index} className="avatar" src={participantProfileMap[user.userId] || '/avatar.png'} alt={user.username || user.name || 'user'} />
                        ))}
                      </div>
                      {participantCount > 3 && (
                        <span className="plus-count"><FaUsers className="all-event-icon" /> +{participantCount - 3}</span>
                      )}
                    </div>
                  ) : <div className="no-participants-text">No participants yet</div>}
                </div>
                <div className="event-date-container">
                  <div className="event-date-box">
                    <div className="event-date-top">{month}</div>
                    <div className="event-date-middle">{day}</div>
                    <div className="event-date-bottom">{startTime} - {endTime}</div>
                  </div>
                  <Link to={`/events/${event.eventId}`} className="event-view-btn">View</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllEvents;
