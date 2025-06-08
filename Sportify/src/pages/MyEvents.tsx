import { useEffect, useState } from 'react';
import {
  fetchEvents,
  deleteEvent,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
} from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import '../Style/MyEvents.css';
import bgWhite from '../assets/Slide 16_9 - 5.png';
import { Circles } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const showToast = (message: string, type: 'success' | 'error') => {
    const styles = {
      success: {
        background: 'linear-gradient(to right, #28a745, #56d679)',
        color: 'white',
      },
      error: {
        background: 'linear-gradient(to right, #d9534f, #e57373)',
        color: 'white',
      },
    };

    toast(message, {
      style: {
        ...styles[type],
        fontWeight: 'bold',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '16px',
        textAlign: 'center',
        width: '100%',
      },
    });
  };

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setMyEvents(myEvents.filter((e) => e.eventId !== eventId));
        showToast('Event deleted successfully!', 'error');
      } catch (err) {
        console.error(err);
        showToast('Failed to delete event.', 'error');
      }
    }
  };

  const handleApprove = async (eventId: number, userId: number) => {
    const approverUserId = Number(localStorage.getItem('userId'));
    try {
      await approveRequest(eventId, userId, approverUserId);
      setPendingRequests((prev) =>
        prev.filter((req) => !(req.eventId === eventId && req.userId === userId))
      );
      showToast('User approved successfully!', 'success');
    } catch (err) {
      console.error('Failed to approve request', err);
      showToast('Failed to approve user.', 'error');
    }
  };

  const handleReject = async (eventId: number, userId: number) => {
    const approverUserId = Number(localStorage.getItem('userId'));
    try {
      await rejectRequest(eventId, userId, approverUserId);
      setPendingRequests((prev) =>
        prev.filter((req) => !(req.eventId === eventId && req.userId === userId))
      );
      showToast('User rejected.', 'error');
    } catch (err) {
      console.error('Failed to reject request', err);
      showToast('Failed to reject user.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="my-events-page event-loading-container">
        <Circles height="80" width="80" color="#ff9100" ariaLabel="loading-events" />
        <p className="loading-message">Gathering your events...</p>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div
        className="my-bg-image"
        style={{
          backgroundImage: `url(${bgWhite})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '65vh',
        }}
      >
        <h1 className="my-section-title">My Events</h1>

        {myEvents.length === 0 ? (
          <p className="my-empty-text">You haven't created any events yet.</p>
        ) : (
          <div className="my-events-grid">
            {myEvents.map((event) => (
              <div key={event.eventId} className="my-event-card">
                <img
                  src={event.imageUrl || '/placeholder.jpg'}
                  alt={event.title}
                  className="my-event-img"
                />
                <div className="my-event-content">
                  <h2 className="my-event-title">{event.title}</h2>
                  <p className="my-event-meta">
                    {new Date(event.startDateTime).toLocaleString()} -{' '}
                    {new Date(event.endDateTime).toLocaleTimeString()}
                  </p>
                  <p className="my-event-meta">📍 {event.location}</p>

                  <div className="my-event-actions">
                    <Link to={`/events/${event.eventId}`} className="my-btn my-update-btn">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      className="my-btn my-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="my-section-title">Pending Join Requests</h2>

      {pendingRequests.length > 0 && (
        <div className="my-pending-section">
          <div className="my-pending-list">
            {pendingRequests.map((req) => (
              <div key={`${req.eventId}-${req.userId}`} className="join-request-box">
                <div className="join-request-info">
                  <p>
                    <strong>{req.user?.name || 'Unknown User'}</strong> wants to join{' '}
                    <strong>{req.event?.title || 'Unknown Event'}</strong>
                  </p>
                </div>
                <div className="join-request-buttons">
                  <button
                    className="my-approve-btn"
                    onClick={() => handleApprove(req.eventId, req.userId)}
                  >
                    Accept
                  </button>
                  <button
                    className="my-reject-btn"
                    onClick={() => handleReject(req.eventId, req.userId)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeButton={false}
      />
    </div>
  );
}

export default MyEvents;
