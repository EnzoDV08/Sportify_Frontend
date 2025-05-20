import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';

function AllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  console.log("Event IDs:", events.map(e => e.eventId));

  return (
    <div>
      <h1>All Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.eventId}>
            <Link to={`/events/${event.eventId}`}>
              <strong>{event.title}</strong> — {event.location}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllEvents;
