import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import '../Style/AllEvents.css';

import {
  FaMapMarkerAlt,
  FaUsers,
  FaLock,
  FaUnlock,
  FaClock,
  FaSearch
} from 'react-icons/fa';


function isThisWeek(dateString: string): boolean {
  const today = new Date();
  const eventDate = new Date(dateString);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return eventDate >= startOfWeek && eventDate <= endOfWeek;
}

function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const thisWeekEvents = filteredEvents.filter(event => isThisWeek(event.date));
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  if (loading) return <p className="loading">Loading events...</p>;

  return (
    <div className="all-events-page">
      <div className="event-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="events-this-week-grid">
        <div className="main-column">
          <h2 className="section-subtitle">EVENTS THIS WEEK</h2>
          <div className="week-event-grid">
            {thisWeekEvents.length > 0 ? (
              thisWeekEvents.map((event) => {
                const date = new Date(event.date);
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });

                return (
                  <div key={event.eventId} className="week-grid-card">
                    <div className="week-grid-img" />
                    <div className="week-grid-info">
                      <div className="week-card-header">
                        <span className="host-tag">HOSTED BY SUPERSPORT</span>
                        <span className="status-tag started">Starting Soon</span>
                      </div>
                      <h3 className="week-grid-title">{event.title}</h3>
                      <div className="week-grid-meta">
                        <p>{day} {month} · {time} · {event.location}</p>
                      </div>
                      <div className="week-grid-footer">
                        <span className="visibility-tag public">Public</span>
                        <button className="view-button">View</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No events this week.</p>
            )}
          </div>
        </div>

        <div className="sidebar-column">
          <h3 className="sidebar-title">Past Events</h3>
          <div className="past-events">
            {pastEvents.slice(0, 3).map((event, index) => {
              const date = new Date(event.date);
              const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });

              return (
                <div key={event.eventId} className="past-card">
                  <div className="past-image" />
                  <div className="past-overlay">
                    <span className="ended-tag">Ended</span>
                    <p className="past-title">{event.title}</p>
                    <p className="past-meta">{day} {month} · {time}<br />📍 {event.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h1 className="section-title">Upcoming Events</h1>

      <div className="events-container">
        {filteredEvents.map((event) => {
          const dateObj = new Date(event.date);
          const month = dateObj.toLocaleString('default', { month: 'short' });
          const day = dateObj.getDate();
          const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={event.eventId} className="event-card">
              <div className="event-image-placeholder"></div>

              <div className="event-details">
                <h2 className="event-title underline-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>

                <div className="event-location">
                  <FaMapMarkerAlt className="event-icon" />
                  {event.location}
                </div>

                <div className="event-tags">
                  <span className={`visibility-tag ${event.visibility?.toLowerCase()}`}>
                    {event.visibility?.toLowerCase() === 'private' ? (
                      <>
                        <FaLock className="event-icon" /> Private
                      </>
                    ) : (
                      <>
                        <FaUnlock className="event-icon" /> Public
                      </>
                    )}
                  </span>
                </div>

                <div className="hosted-info">
                  <div className="host-logo-placeholder"></div>
                  <span className="hosted-by">
                    <strong>HOSTED BY SUPERSPORT</strong>
                  </span>
                </div>

                <div className="avatar-stack">
                  <div className="avatars">
                    <div className="avatar" />
                    <div className="avatar" />
                    <div className="avatar" />
                  </div>
                  <span className="plus-count">
                    <FaUsers className="event-icon" /> +5
                  </span>
                </div>
              </div>

              <div className="event-date-box">
                <div className="date-block">
                  <div className="month">{month}</div>
                  <div className="day">{day}</div>
                  <div className="time">
                    <FaClock className="event-icon" />
                    {time}
                  </div>
                </div>
                <Link to={`/events/${event.eventId}`} className="view-btn">
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
