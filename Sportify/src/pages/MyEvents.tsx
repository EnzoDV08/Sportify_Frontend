import { useEffect, useState } from 'react';
import { fetchEvents, deleteEvent, fetchPendingRequests, approveRequest, rejectRequest } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import '../Style/MyEvents.css';

interface PendingRequest {
  eventId: number;
  userId: number;
  status: string;
  user?: {
    userId: number;
    name: string;
    email: string;
  };
  event?: {
    eventId: number;
    title: string;
  };
}

function MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    fetchEvents()
      .then((events) => {
        const filtered = events.filter((event) => event.creatorUserId === userId);
        setMyEvents(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchPendingRequests(userId)
      .then(setPendingRequests)
      .catch(console.error);
  }, [userId]);

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      setMyEvents(myEvents.filter(e => e.eventId !== eventId));
    }
  };

  const handleApprove = async (eventId: number, userId: number) => {
    const approverUserId = Number(localStorage.getItem('userId'));
    try {
      await approveRequest(eventId, userId, approverUserId);
      setPendingRequests(prev =>
        prev.filter(req => !(req.eventId === eventId && req.userId === userId))
      );
    } catch (err) {
      console.error('Failed to approve request', err);
    }
  };

  const handleReject = async (eventId: number, userId: number) => {
    const approverUserId = Number(localStorage.getItem('userId'));
    try {
      await rejectRequest(eventId, userId, approverUserId);
      setPendingRequests(prev => prev.filter(req => !(req.eventId === eventId && req.userId === userId)));
    } catch (err) {
      console.error('Failed to reject request', err);
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

      {pendingRequests.length > 0 && (
        <div className="my-pending-section">
          <h2 className="my-section-title">Pending Join Requests</h2>
          <div className="my-pending-list">
            {pendingRequests.map(req => (
              <div key={`${req.eventId}-${req.userId}`} className="join-request-box">
                <div className="join-request-info">
                  <p>
                    <strong>{req.user?.name || 'Unknown User'}</strong> wants to join <strong>{req.event?.title || 'Unknown Event'}</strong>
                  </p>
                </div>
                <div className="join-request-buttons">
                  <button className="my-approve-btn" onClick={() => handleApprove(req.eventId, req.userId)}>Accept</button>
                  <button className="my-reject-btn" onClick={() => handleReject(req.eventId, req.userId)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEvents;
