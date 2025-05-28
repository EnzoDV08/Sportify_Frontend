import { useEffect, useState } from 'react';
import { fetchEvents, deleteEvent } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import '../Style/MyEvents.css';

function MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    fetchEvents()
      .then((events) => {
        const filtered = events.filter((event) => event.creatorUserId === userId);
        setMyEvents(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      setMyEvents(myEvents.filter(e => e.eventId !== eventId));
    }
  };

  if (loading) return <p className="my-loading-text">Loading your events...</p>;

  return (
    <div className="my-events-page">
      <h1 className="my-section-title">My Events</h1>

      {myEvents.length === 0 ? (
        <p className="my-empty-text">You haven't created any events yet.</p>
      ) : (
        <div className="my-events-grid">
          {myEvents.map(event => (
            <div key={event.eventId} className="my-event-card">
              <img src={event.imageUrl || '/placeholder.jpg'} alt={event.title} className="my-event-img" />
              <div className="my-event-content">
                <h2 className="my-event-title">{event.title}</h2>
                <p className="my-event-meta">
                  {new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleTimeString()}
                </p>
                <p className="my-event-meta">📍 {event.location}</p>

                <div className="my-event-actions">
                  <Link to={`/events/${event.eventId}`} className="my-btn my-update-btn">View</Link>
                  <button onClick={() => handleDelete(event.eventId)} className="my-btn my-delete-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
