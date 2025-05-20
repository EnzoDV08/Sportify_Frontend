import { useState } from 'react';
import { Event } from '../models/event';
import '../Style/CreateEvent.css';

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [status, setStatus] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = Number(localStorage.getItem('userId'));

    const newEvent: Event = {
      title,
      description,
      date,
      location,
      type,
      visibility,
      status,
      isPrivate,
      creatorId: userId,
      adminId: userId,
      eventId: 0, 
      invitedUserIds: null,
      latitude: null,
      longitude: null,
    };

    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      alert('Event created!');
    } else {
      alert('Failed to create event.');
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create a New Event</h2>
      <form className="create-event-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          <option value="training">Training</option>
          <option value="match">Match</option>
          <option value="meetup">Meetup</option>
        </select>

        <label>Visibility</label>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="">Select visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private Event?
        </label>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
