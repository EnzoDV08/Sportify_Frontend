import { useEffect, useState } from 'react';
import { Event } from '../models/event';
import { fetchEvents, fetchProfile } from '../services/api';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Style/EventsNearby.css';
import fallbackImage from '../assets/image 33.png';

interface ProfilePictureProps {
  userId: number;
}

const ProfilePicture = ({ userId }: ProfilePictureProps) => {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile(userId);
        if (res?.profilePicture) {
          setProfileUrl(`${baseUrl}/${res.profilePicture}`);
        }
      } catch {
        setProfileUrl(null);
      }
    };
    load();
  }, [userId]);

  return profileUrl ? (
    <img src={profileUrl} alt="user" className="participant-circle" />
  ) : (
    <div className="participant-circle bg-gray-400 text-white text-xs flex items-center justify-center">?</div>
  );
};

const EventsNearby = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      let userRegion = 'gauteng';

      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        userRegion = (geoData.region || geoData.city || '').toLowerCase().trim();
      } catch {
        userRegion = 'gauteng';
      }

      const allEvents = await fetchEvents();

      const nearby = allEvents.filter((e) => {
        const loc = e.location?.toLowerCase() || '';
        return loc.includes('gauteng') || userRegion.includes('gauteng');
      });

      setEvents(nearby.slice(0, 5));
      setLoading(false);
    };

    loadEvents();
  }, []);

  return (
    <section className="nearby-events-section">
      <h2 className="nearby-title">EVENTS NEARBY</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner text-orange-500 loading-lg" role="status"></span>
        </div>
      ) : (
        <div className="nearby-events-list fade-in">
          {events.map((event) => {
            const date = new Date(event.startDateTime);
            const month = date.toLocaleString('default', { month: 'short' });
            const day = date.getDate();
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const isBearded = event.creatorUserId === 2;
            const creatorName = event.creator?.name || 'UNKNOWN';

            return (
              <div key={event.eventId} className="nearby-event-card">
                <div className="nearby-image">
                  <img src={event.imageUrl || fallbackImage} alt="Event" />
                </div>

                <div className="nearby-info">
                  <h3>{event.title}</h3>
                  <p className="location"><FaMapMarkerAlt /> {event.location}</p>
                  <p className="host">
                    {isBearded ? (
                      <>
                        <img src="/AdminLogo.png" alt="Bearded" className="inline w-5 h-5 mr-1 align-middle" />
                        HOSTED BY BEARDED
                      </>
                    ) : (
                      <>
                        <ProfilePicture userId={event.creatorUserId} />
                        <span className="ml-1">HOSTED BY {creatorName}</span>
                      </>
                    )}
                  </p>

                  <div className="participants">
                    {(event.participants || []).slice(0, 3).map((p) => (
                      <ProfilePicture key={p.userId} userId={p.userId} />
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
      )}
    </section>
  );
};

export default EventsNearby;



