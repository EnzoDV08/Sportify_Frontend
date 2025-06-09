import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSingleEvent, fetchEvents, joinEvent, fetchProfile } from '../services/api';
import { Event } from '../models/event';
import { fetchUserById } from '../services/api';
import '../Style/SingleEvents.css';
import { Circles } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';



const resolveImageUrl = (path: string | undefined | null): string => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!path) return '/avatar.png';
  if (path.startsWith('http')) return path;
  if (path.includes('/uploads')) return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  return `${base}/uploads/${path}`;
};

function SingleEvent() {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [participantProfiles, setParticipantProfiles] = useState<Record<number, string>>({});
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      setError('Invalid event ID.');
      setLoading(false);
      return;
    }

    fetchSingleEvent(eventId)
      .then(async (fetched) => {
        const participants = fetched.participants ?? [];
        const creatorId = fetched.creatorUserId;

        const alreadyIncluded = participants.some(p => p.userId === creatorId);
        if (!alreadyIncluded) {
          try {
            const creator = await fetchUserById(creatorId);
            participants.unshift({ ...creator, status: 'Approved' });
          } catch (e) {
            participants.unshift({
              userId: creatorId,
              name: 'Event Creator',
              email: '',
              password: '',
              status: 'Approved'
            });
          }
        }

        fetched.participants = participants;
        setEvent(fetched);

        const profileMap: Record<number, string> = {};
        await Promise.all(
          participants.map(async (p) => {
            try {
              const profile = await fetchProfile(p.userId);
              profileMap[p.userId] = resolveImageUrl(profile?.profilePicture);
            } catch {
              profileMap[p.userId] = '/avatar.png';
            }
          })
        );
        setParticipantProfiles(profileMap);
      })
      .catch(() => setError('Failed to fetch event.'))
      .finally(() => setLoading(false));

    fetchEvents().then(events => {
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

  const handleJoin = async () => {
    if (!event) return;
    try {
      await joinEvent(event.eventId, userId);
      toast.success('🎉 Join request sent!');
      setEvent({
        ...event,
        participants: [...(event.participants || []), {
          userId,
          name: 'You',
          email: '',
          password: '',
          status: 'Pending'
        }]
      });
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to join event.');
    }
  };

  if (loading) {
    return (
      <div className="single-events-page event-loading-container">
        <Circles height="80" width="80" color="#ff9100" ariaLabel="loading-events" />
        <p className="loading-message">Unpacking the event details...</p>
      </div>
    );
  }
  if (error) return <p className="single-error-text">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  const currentParticipant = event.participants?.find(p => p.userId === userId);
  const userStatus = currentParticipant?.status?.toLowerCase();

  return (
    <div className="single-event-page">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar closeButton={false} />

      <div className="single-event-banner" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <h1 className="single-banner-title">{event.title}</h1>
        <div className="single-countdown-timer">
          <div><span>{String(countdown.days).padStart(2, '0')}</span> Days</div>
          <div><span>{String(countdown.hours).padStart(2, '0')}</span> Hours</div>
          <div><span>{String(countdown.minutes).padStart(2, '0')}</span> Minutes</div>
          <div><span>{String(countdown.seconds).padStart(2, '0')}</span> Seconds</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {event.creatorUserId === userId ? (
            <Link to={`/edit-event/${event.eventId}`} className="single-join-button">Edit Event</Link>
          ) : userStatus === 'approved' ? (
            <button className="single-join-button" disabled>Joined</button>
          ) : userStatus === 'pending' ? (
            <button className="single-join-button" disabled>Pending</button>
          ) : (
            <button className="single-join-button" onClick={handleJoin}>Join</button>
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
          <iframe
            className="single-event-map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(event.location?.trim() || 'South Africa')}&output=embed`}
            allowFullScreen
            loading="lazy"
          ></iframe>
          <div className="single-requirements">
            <h3>Requirements</h3>
            <ul className="requirements-list">
              {event.requiredItems?.split(',').map((item, index) => (
                <li key={index}>
                  <FaCheckCircle className="requirement-icon" />
                  {item.trim()}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/events" className="single-back-link">← Back to All Events</Link>
        </div>

        <div className="single-event-info-right">
          <div className="single-participants-section">
            <h3>Participants</h3>
            {event.participants && event.participants.length > 0 ? (
              event.participants.map(user => (
                <div key={user.userId} className="single-participant">
                  <img src={participantProfiles[user.userId] || '/avatar.png'} alt="avatar" />
                  <span>{user.name}</span>
                  <button onClick={() => navigate(`/view-profile/${user.userId}`)}>View Profile</button>
                </div>
              ))
            ) : (
              <p>No participants yet.</p>
            )}
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
                      <p className="single-event-meta"><FaClock /> {day} · {time}</p>
                      <p className="single-event-meta"><FaMapMarkerAlt /> {event.location}</p>
                  </div>
                  <div className="single-event-footer">
                    <button
                      className="single-event-week-view-btn"
                      onClick={() => {
                        navigate(`/events/${event.eventId}`);
                        setLoading(true);
                      }}
                    > View</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleEvent;
