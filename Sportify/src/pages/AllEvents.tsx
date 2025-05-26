import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaSearch
} from 'react-icons/fa';
import '../Style/AllEvents.css';
import bgWhite from '../assets/Slide 16_9 - 5.png';

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

  return (
    startDate >= startOfWeek &&
    startDate <= endOfWeek &&
    endDate >= now // still ongoing or future
  );
}


function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
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

  const thisWeekEvents = filteredEvents.filter(event =>
    isThisWeekAndNotEnded(event.startDateTime, event.endDateTime)
  );
  const now = new Date();

    const upcomingEvents = filteredEvents
      .filter(event => new Date(event.startDateTime) >= now)
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

    const pastEvents = filteredEvents
      .filter(event => new Date(event.startDateTime) < now)
      .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());

  const displayedEvents = view === 'upcoming' ? upcomingEvents : pastEvents;

  if (loading) return <p className="loading-text">Loading events...</p>;

  return (
    <div className="all-events-page">
      <div className="events-section-white"
        style={{
          backgroundImage: `url(${bgWhite})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '65vh',
        }}>
        <div className="event-header">
          <div className="event-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="event-input"
            />
          </div>
        </div>

        <div className="section-divider"></div>
        <div className="events-grid">
          <div className="main-column">
            <h2 className="section-subtitle">EVENTS THIS WEEK</h2>
            <div className="week-events">
              {thisWeekEvents.length > 0 ? (
                thisWeekEvents.map((event) => {
                  const start = new Date(event.startDateTime);
                  const formattedStart = start.toLocaleString('default', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <div key={event.eventId} className="event-card-week">
                      <div className="event-img-container">
                        <div className="hosted-badge">
                          <img src="/avatar.png" alt="Host" className="hosted-avatar" />
                          <span className="hosted-text">HOSTED BY BEARDED</span>
                        </div>
                        <img src={event.imageUrl || '/placeholder.jpg'} alt="Event" className="event-img" />
                        {(() => {
                          const now = new Date();
                          const start = new Date(event.startDateTime);
                          const end = new Date(event.endDateTime);

                          let label = "Upcoming";
                          let statusClass = "status-upcoming"; 

                          const isToday = now.toDateString() === start.toDateString();

                          if (now >= start && now <= end) {
                            label = "Started";
                            statusClass = "status-started"; 
                          } else if (isToday && now < start) {
                            label = "Starting Soon";
                            statusClass = "status-starting"; 
                          }

                          return (
                            <div className={`event-status ${statusClass}`}>{label}</div>
                          );
                        })()}

                      </div>
                      <div className="event-body">
                        <h3 className="week-event-title">{event.title}</h3>
                        <p className="event-meta"><FaClock className="event-icon" /> {formattedStart}</p>
                        <p className="event-meta"><FaMapMarkerAlt className="event-icon" /> {event.location}</p>
                      </div>
                      <div className="event-footer">
                        <span className="week-event-visibility">{event.visibility?.toUpperCase() || "PUBLIC"}</span>
                        <Link to={`/events/${event.eventId}`} className="event-week-view-btn">View</Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h6>No events this week.</h6>
              )}
            </div>
          </div>
        </div>
      </div>

      <h1 className="event-section-title">
        {view === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
      </h1>

      {/* Toggle Buttons */}
      <div className="event-toggle-buttons">
        <button
          className={view === 'upcoming' ? 'toggle-active' : ''}
          onClick={() => setView('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={view === 'past' ? 'toggle-active' : ''}
          onClick={() => setView('past')}
        >
          Past Events
        </button>
      </div>

      <div className="upcoming-events">
        {displayedEvents.map((event) => {
          const start = new Date(event.startDateTime);
          const end = new Date(event.endDateTime);
          const month = start.toLocaleString('default', { month: 'long' });
          const day = start.getDate();
          const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={event.eventId} className="event-card-upcoming">
              <div className="event-img-upcoming">
                <img src={event.imageUrl || '/placeholder.jpg'} alt="Event" className="event-img" />
              </div>
              <div className="event-details-upcoming">
                <div className="event-title-row">
                  <h2 className="event-title">{event.title}</h2>
                  <span className={`event-visibility ${event.visibility?.toLowerCase()}`}>
                    {event.visibility?.toUpperCase() || 'PUBLIC'}
                  </span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-location">
                  <FaMapMarkerAlt className="event-icon" /> {event.location}
                </div>
                <div className="hosted-info">
                  <div className="host-logo-placeholder" />
                  <span className="hosted-by">HOSTED BY SUPERSPORT</span>
                </div>
                <div className="avatar-stack">
                  <div className="avatars">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="avatar" />
                    ))}
                  </div>
                  <span className="plus-count">
                    <FaUsers className="event-icon" /> +5
                  </span>
                </div>
              </div>
              <div className="event-date-container">
                <div className="event-date-box">
                  <div className="event-date-top">{month}</div>
                  <div className="event-date-middle">{day}</div>
                  <div className="event-date-bottom">{startTime} &ndash; {endTime}</div>
                </div>
                <Link to={`/events/${event.eventId}`} className="event-view-btn">
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllEvents;
