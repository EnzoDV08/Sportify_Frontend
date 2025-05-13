import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchEvents()
    .then(data => {
      console.log('✅ Events fetched:', data);
      setEvents(data);
    })
    .catch(err => {
      console.error('❌ Error fetching events:', err);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Event List</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.title}</strong> — {event.location} on {new Date(event.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
