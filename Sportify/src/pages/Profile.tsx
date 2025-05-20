import React from 'react';
import '../Style/Profile.css';
import image48 from '../assets/image 48.png';
import image33 from '../assets/image 33.png';
import image49 from '../assets/image 49.png';

function Profile() {
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          <h1>Pieter Man</h1>
          <p><span className="label">Email:</span> pieterDieMan@gmail.com</p>
          <p><span className="label">Nickname:</span> DieManPieta</p>
          <p><span className="label">Favourite sport:</span> Netbal</p>
          <p><span className="label">Date of Birth:</span> 09/12/1996</p>
          <p><span className="label">Age:</span> 29</p>
        </div>
        <div className="profile-about">
          <p className="about-heading">Who Am I?</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="profile-avatar">
          <img src="/placeholder-profile.jpg" alt="Profile" />
          <button>Edit Profile</button>
        </div>
      </div>

      {/* Icons */}
      <div className="profile-icons">
        <div className="icons-bar">
          <span>🏀</span>
          <span>🏓</span>
          <span>⛳</span>
          <span>🛏️</span>
          <span>🧪</span>
        </div>
        <p className="view-all">View all</p>
      </div>

      {/* Overall Stats */}
      <h2 className="section-title">Overall Stats</h2>
      <div className="stats-wrapper">
        <div className="stats-container">
          <div className="stats-box">
            <span>Competed Events</span>
            <span>8</span>
          </div>
          <div className="stats-box">
            <span>Active Event Time</span>
            <span>300h</span>
          </div>
          <div className="stats-box">
            <span>First Places</span>
            <span>3</span>
          </div>
          <div className="stats-box">
            <span>Second Places</span>
            <span>6</span>
          </div>
          <div className="stats-box">
            <span>Third Places</span>
            <span>4</span>
          </div>
          <div className="stats-box">
            <span>Total Points</span>
            <span>3059</span>
          </div>
        </div>
      </div>

<h2 className="section-title">Events won</h2>
<div className="events-won-section">

{/* Wall Climbing Event */}
<div className="event-card">
  <div className="event-image-container">
    <img src={image48} alt="event1" className="event-image" />
    <span className="event-status">Ended</span>
  </div>
  <div className="event-details">
    <div className="event-header">
      <h3 className="event-title">Wall Climbing Event</h3>
      <span className="event-type">Public</span>
    </div>
    <p className="event-description">
      A high-energy padel event open to all skill levels. Come compete or just have fun!
    </p>
    <div className="event-meta">
      <div className="event-date"><span>🗓</span> 12 May · 17:00</div>
      <div className="event-location"><span>📍</span> Cape Town Stadium</div>
      <div className="event-tags">
        <span>🏟 Indoor</span>
        <span>🔥 Active</span>
        <span>🎉 Fun</span>
      </div>
    </div>
    <div className="event-host">
      <span>#1</span>
      <img src="/images/profile.jpg" alt="host" className="host-img" />
      <span className="host-name">Pieter Man</span>
    </div>
  </div>
</div>


  {/* Beach Ball Showdown */}
<div className="event-card">
  <div className="event-image-container">
    <img src={image33} alt="event2" className="event-image" />
    <span className="event-status">Ended</span>
  </div>
  <div className="event-details">
    <div className="event-header">
      <h3 className="event-title">Beach Ball Showdown</h3>
      <span className="event-type">Public</span>
    </div>
    <p className="event-description">
      A high-energy Beach Ball event open to all skill levels. Come compete or just have fun!
    </p>
    <div className="event-meta">
      <div className="event-date"><span>🗓</span> 26 May · 14:00</div>
      <div className="event-location"><span>📍</span> Pretoria</div>
      <div className="event-tags">
        <span>🏟 Outdoor</span>
        <span>🔥 Active</span>
        <span>🎉 Fun</span>
      </div>
    </div>
    <div className="event-host">
      <span>#1</span>
      <img src="/images/profile.jpg" alt="host" className="host-img" />
      <span className="host-name">Pieter Man</span>
    </div>
  </div>
</div>

  {/* Rugby Tournament */}
<div className="event-card">
  <div className="event-image-container">
    <img src={image49} alt="event3" className="event-image" />
    <span className="event-status">Ended</span>
  </div>
  <div className="event-details">
    <div className="event-header">
      <h3 className="event-title">Rugby Tournament</h3>
      <span className="event-type">Public</span>
    </div>
    <p className="event-description">
      A high-energy Rugby Tournament open to all skill levels. Come compete or just have fun!
    </p>
    <div className="event-meta">
      <div className="event-date"><span>🗓</span> 12 June · 17:00</div>
      <div className="event-location"><span>📍</span> Cape Town Stadium</div>
      <div className="event-tags">
        <span>🏟 Outdoor</span>
        <span>🔥 Active</span>
        <span>🎉 Fun</span>
      </div>
    </div>
    <div className="event-host">
      <span>#1</span>
      <img src="/images/profile.jpg" alt="host" className="host-img" />
      <span className="host-name">Pieter Man</span>
    </div>
  </div>
</div>

</div>

    </div>
  );
}

export default Profile;
