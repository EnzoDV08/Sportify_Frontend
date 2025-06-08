import { useEffect, useState } from 'react';
import { fetchInvitedEvents, acceptInvite, rejectInvite } from '../services/api';
import { Event } from '../models/event';
import '../Style/InvitedEvents.css';

const InvitedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const userId = Number(localStorage.getItem('userId'));

  const loadInvites = () => {
    fetchInvitedEvents(userId)
      .then(setEvents)
      .catch((err) => console.error('❌ Failed to fetch invited events:', err));
  };

  useEffect(() => {
    loadInvites();
  }, [userId]);

  const handleAccept = async (eventId: number) => {
    try {
      await acceptInvite(eventId, userId);
      loadInvites(); // refresh list
    } catch (err) {
      console.error('❌ Accept failed', err);
    }
  };

    const handleReject = async (eventId: number) => {
    try {
        await rejectInvite(eventId, userId); 
        setEvents(events.filter(e => e.eventId !== eventId)); 
    } catch (err) {
        console.error('Failed to reject invite:', err);
    }
    };

  return (
    <div className="invited-events-page">
      <h2>You're Invited To:</h2>
      {events.length === 0 ? (
        <p>No event invites yet.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.eventId} className="invited-event-card">
            <div className="invited-event-content">
                <h3>{event.title}</h3>
                <p>📍 {event.location}</p>
                <p>🕒 {new Date(event.startDateTime).toLocaleString()}</p>
                <p>{event.description}</p>
            </div>

            <div className="invite-actions">
                <button className="accept-btn" onClick={() => handleAccept(event.eventId)}>Accept</button>
                <button className="reject-btn" onClick={() => handleReject(event.eventId)}>Reject</button>
            </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitedEvents;
