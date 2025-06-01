import { useState } from 'react';
import { createEvent } from '../services/api';
import '../Style/CreateEvent.css';

// Set up state for each input field
function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [status, setStatus] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the logged-in user's ID
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('User not logged in.');
      return;
    }

  // Send event data to backend
    try {
      await createEvent(
        {
          title,
          description,
          date,
          location,
          type,
          visibility,
          status,
        },
        userId
      );

      alert('Event created successfully!');
      // Clear form
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setType('');
      setVisibility('');
      setStatus('');
      setIsPrivate(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create event.');
    }
  };

  return (
    <div className="create-event-container">
      <form className="create-event-form" onSubmit={handleSubmit}>
        <h2>Create a New Event</h2>

        <div className="form-group full">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group half">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group half">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group half">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select type</option>
            <option value="training">Training</option>
            <option value="match">Match</option>
            <option value="meetup">Meetup</option>
          </select>
        </div>

        <div className="form-group half">
          <label>Visibility</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} required>
            <option value="">Select visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="form-group full">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
