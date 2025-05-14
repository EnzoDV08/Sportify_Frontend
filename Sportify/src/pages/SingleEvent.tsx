import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleEvent } from '../services/api';
import { Event } from '../models/event';

function SingleEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventId = Number(id);

    if (isNaN(eventId)) {
      setError('Invalid event ID.');
      setLoading(false);
      return;
    }

    fetchSingleEvent(eventId)
      .then(setEvent)
      .catch(err => {
        console.error('Error fetching event:', err);
        setError('Failed to fetch event.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{event.title}</h1>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {event.status || 'Not specified'}</p>
      <p><strong>Type:</strong> {event.type || 'Not specified'}</p>
      {event.description && (
        <p><strong>Description:</strong> {event.description}</p>
      )}

      <Link to="/events">
        ← Back to All Events
      </Link>
    </div>
  );
}

export default SingleEvent;
