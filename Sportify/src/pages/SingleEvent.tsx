import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleEvent, fetchEvents, joinEvent } from '../services/api';
import { Event } from '../models/event';
import '../Style/SingleEvents.css';

function SingleEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      setError('Invalid event ID.');
      setLoading(false);
      return;
    }

    fetchSingleEvent(eventId)
      .then(setEvent)
      .catch(() => setError('Failed to fetch event.'))
      .finally(() => setLoading(false));

    fetchEvents()
      .then(events => {
        const now = new Date();
        const filtered = events
          .filter(e => e.eventId !== eventId && new Date(e.startDateTime) > now)
          .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
          .slice(0, 2);
        setOtherEvents(filtered);
      });
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(event.startDateTime).getTime();
      const distance = start - now;

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p className="single-error-text">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="single-event-page">
      <div className="single-event-banner" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <h1 className="single-banner-title">{event.title}</h1>
        <div className="single-countdown-timer">
          <div><span>{String(countdown.days).padStart(2, '0')}</span> Days</div>
          <div><span>{String(countdown.hours).padStart(2, '0')}</span> Hours</div>
          <div><span>{String(countdown.minutes).padStart(2, '0')}</span> Minutes</div>
          <div><span>{String(countdown.seconds).padStart(2, '0')}</span> Seconds</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="single-join-button"
          onClick={async () => {
            try {
              await joinEvent(event.eventId, userId);
              alert('Join request sent!');
            } catch (err) {
              alert('Failed to join event');
              console.error(err);
            }
          }}
        >
          JOIN
        </button>
        {event.creatorUserId === userId && (
          <Link to={`/edit-event/${event.eventId}`} className="single-join-button">
            Edit Event
          </Link>
        )}
  </div>
      </div>

      <div className="single-event-main-content">
        <div className="single-event-info-left">
          <h2 className="single-event-name">{event.title}</h2>
          <div className="single-event-time-location">
            <div className="single-time-block">
              {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="single-location-block">{event.location}</div>
          </div>
          <iframe className="single-event-map" src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`} allowFullScreen loading="lazy"></iframe>

          <div className="single-requirements">
            <h3>Requirements</h3>
            <ul>
              {event.requiredItems?.split(',').map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          </div>
          <Link to="/events" className="single-back-link">← Back to All Events</Link>
        </div>

        <div className="single-event-info-right">
          <div className="single-participants-section">
            <h3>Participants <span className="single-view-all">View all</span></h3>
            <div className="single-participant">
              <img src="/avatar.png" alt="avatar" />
              <span>David Beckham</span>
              <button>View Profile</button>
            </div>
            <div className="single-participant">
              <img src="/avatar.png" alt="avatar" />
              <span>Raphaël Junior</span>
              <button>View Profile</button>
            </div>
            <div className="single-participant">
              <img src="/avatar.png" alt="avatar" />
              <span>Jana Roberts</span>
              <button>View Profile</button>
            </div>
          </div>

          <div className="single-other-events-section">
            <h3>Other Events</h3>
            {otherEvents.map(event => {
              const date = new Date(event.startDateTime);
              const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const day = date.toLocaleDateString();

              return (
                <div key={event.eventId} className="single-other-event-card">
                  <div className="single-event-img-container">
                    <img src={event.imageUrl || '/placeholder.jpg'} alt={event.title} className="single-event-img" />
                    <div className="single-event-status">Upcoming</div>
                  </div>
                  <div className="single-event-body">
                    <h4 className="single-week-event-title">{event.title}</h4>
                    <p className="single-event-meta">{day} · {time}</p>
                    <p className="single-event-meta">{event.location}</p>
                  </div>
                  <div className="single-event-footer">
                    <Link to={`/events/${event.eventId}`} className="single-event-week-view-btn">View</Link>
                  </div>
                </div>
              );
            })}
            <Link to="/events">
              <button className="single-all-events-button">Go to All Events</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleEvent;