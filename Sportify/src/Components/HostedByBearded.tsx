import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Event } from '../models/event';
import { Link } from 'react-router-dom';
import '../Style/HostedByBearded.css';
import BeardedLogo from '../assets/AdminLogo.png';
import fallbackImage from '../assets/image 33.png';
import { FaClock, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';


const HostedByBearded = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  fetchEvents()
    .then(fetched => {
      const sorted = [...fetched].sort(
        (a, b) =>
          new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      );
      const latestThree = sorted.slice(0, 3);
      setEvents(latestThree);
      setCurrentIndex(1);
    })
    .catch(console.error);
}, []);

  const [now, setNow] = useState(Date.now());

useEffect(() => {
  const interval = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(interval);
}, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

const getCountdown = (eventDate: string) => {
  const date = new Date(eventDate).getTime();
  const diff = Math.max(0, Math.floor((date - now) / 1000));
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
};





  if (events.length === 0) return null;

  return (
    <section className="bearded-section">
      <h2 className="bearded-title">
        HOSTED BY <span>BEARDED</span>
        <img src={BeardedLogo} alt="Bearded Logo" className="bearded-icon" />
      </h2>
<div className="carousel-container">
  <div className="carousel-track">
    {events.map((event, index) => {
      const isActive = index === currentIndex;
      const offset = index - currentIndex;
      const { days, hours, minutes, seconds } = getCountdown(event.startDateTime);

      return (
        <div
          key={event.eventId}
          className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
          style={{
           transform: `translateX(${offset * 400}px) scale(${isActive ? 1 : 0.92})`,
            zIndex: 10 - Math.abs(offset),
            opacity: isActive ? 1 : 0.5,
          }}
        >
          <div className="card-image">
            <img src={event.imageUrl || fallbackImage} alt={event.title} />
<div className="countdown-overlay">
  <div className="time-box">
    <div className="time-number">{days}</div>
    <div className="time-label">Days</div>
  </div>
  <div className="divider"></div>
  <div className="time-box">
    <div className="time-number">{hours}</div>
    <div className="time-label">Hours</div>
  </div>
  <div className="divider"></div>
  <div className="time-box">
    <div className="time-number">{minutes}</div>
    <div className="time-label">Minutes</div>
  </div>
  <div className="divider"></div>
  <div className="time-box">
    <div className="time-number">{seconds}</div>
    <div className="time-label">Seconds</div>
  </div>
</div>




          </div>
<div className="card-info">
  <div className="card-top">
    <h3>{event.title}</h3>
    <p>{event.description?.slice(0, 120)}...</p>
  </div>

  <div className="card-bottom">
    <div className="card-details-wrapper">
      <div className="card-details-left">
        <div className="icon-text">
          <FaClock />
          <span>
            {new Date(event.startDateTime).toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'short',
            })} ·{" "}
            {new Date(event.startDateTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="icon-text">
          <FaMapMarkerAlt />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="vertical-divider" />

      <div className="card-tags">
        {event.requiredItems?.split(',').map((tag, index) => (
          <div className="card-tag" key={index}>
            <FaCheck />
            <span>{tag.trim()}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="card-footer">
      <div className="card-hosted">
        <img src={BeardedLogo} alt="Bearded Logo" />
        <span>HOSTED BY BEARDED</span>
      </div>
     <Link to={`/events/${event.eventId}`} className="view-btn">
  View Event
</Link>

    </div>
  </div>
</div>

        </div>
      );
    })}
  </div>

  {/* ✅ BOTH arrows inside this one container */}
<div className="carousel-controls">
  <div className="arrow-wrapper">
    <button className="carousel-arrow" onClick={prevCard}>←</button>
    <button className="carousel-arrow" onClick={nextCard}>→</button>
  </div>
</div>
</div>



    </section>
  );
};

export default HostedByBearded;
