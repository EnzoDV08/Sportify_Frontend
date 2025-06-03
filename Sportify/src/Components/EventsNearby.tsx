import { useEffect, useState } from 'react';
import { Event } from '../models/event';
import { fetchEvents } from '../services/api';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Style/EventsNearby.css';
import fallbackImage from '../assets/image 33.png';

const EventsNearby = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // 🌍 1. Get user city using IP
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        const userCity = (ipData.city || '').toLowerCase().trim();

        // 📦 2. Get all events
        const allEvents = await fetchEvents();

        // 🧠 3. Smarter location match (includes fallback)
        const nearby = allEvents.filter((e) => {
          const loc = e.location?.toLowerCase() || '';
          return (
            loc.includes(userCity) ||
            userCity.includes(loc) || // in case city is "Elarduspark" and location is full address
            loc.split(',').some(part => part.trim() === userCity)
          );
        });

        setEvents(nearby.slice(0, 5));
        if (nearby.length === 0) console.warn('📭 No nearby matches for city:', userCity);
      } catch (err) {
        console.error('❌ IP API or event fetch failed:', err);
        const fallback = await fetchEvents();
        setEvents(fallback.slice(0, 5));
      }
    };

    loadEvents();
  }, []);

  return (
    <section className="nearby-events-section">
      <h2 className="nearby-title">EVENTS NEARBY</h2>
      <div className="nearby-events-list">
        {events.map((event) => {
          const date = new Date(event.startDateTime);
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={event.eventId} className="nearby-event-card">
              <div className="nearby-image">
                <img src={event.imageUrl || fallbackImage} alt="Event" />
              </div>

              <div className="nearby-info">
                <h3>{event.title}</h3>
                <p className="location"><FaMapMarkerAlt /> {event.location}</p>
                <p className="host">HOSTED BY {event.creator?.name || 'UNKNOWN'}</p>
                <div className="participants">
                  {(event.participants || []).slice(0, 3).map((p, i) => (
                    <img
                      key={i}
                      className="participant-circle"
                      src={'/avatar.png'}
                      alt={p.name}
                      title={p.name}
                    />
                  ))}
                  <span><FaUsers /> +{event.participants?.length || 0}</span>
                </div>
              </div>

              <div className="nearby-date">
                <div className="date-box">
                  <div className="month">{month}</div>
                  <div className="day">{day}</div>
                  <div className="time">{time}</div>
                </div>
                <Link to={`/events/${event.eventId}`} className="view-btn">View</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventsNearby;
