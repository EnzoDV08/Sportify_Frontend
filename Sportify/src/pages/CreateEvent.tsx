import { useState } from 'react';
import { createEvent } from '../services/api';
import ImageSelector from '../Components/ImageSelector';
import '../Style/CreateEvent.css';


function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [requiredItems, setRequiredItems] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSearchTerm, setImageSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('User not logged in.');
      return;
    }
        console.log("Submitting Event:", {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      type,
      visibility,
      requiredItems,
      imageUrl
    });
    try {
      const cleanedImageUrl = imageUrl.includes('images.unsplash.com')
        ? `${imageUrl.replace(/w=\d+/, 'w=1200')}&auto=format`
        : imageUrl;

    await createEvent(
      {
        title,
        description,
        startDateTime,
        endDateTime,
        location,
        type,
        status: "upcoming",
        visibility,
        requiredItems,
        imageUrl: cleanedImageUrl,
      },
      userId
    );


      alert('Event created successfully!');
      setTitle('');
      setDescription('');
      setStartDateTime('');
      setEndDateTime('');
      setLocation('');
      setType('');
      setVisibility('');
      setRequiredItems('');
      setImageUrl('');
      setImageSearchTerm('');
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
          <label>Start Date & Time</label>
          <input type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} required />
        </div>

        <div className="form-group half">
          <label>End Date & Time</label>
          <input type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} required />
        </div>

        <div className="form-group full">
          <label>Required Items</label>
          <input type="text" value={requiredItems} onChange={(e) => setRequiredItems(e.target.value)} placeholder="e.g. Water bottle, Shoes" />
        </div>

        <div className="form-group full">
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

        {/* 🔍 Custom image search term */}
        <div className="form-group full">
          <label>Image Search Term</label>
          <input
            type="text"
            value={imageSearchTerm}
            onChange={(e) => setImageSearchTerm(e.target.value)}
            placeholder="e.g. marathon, soccer"
          />
        </div>

        <div className="form-group full">
          <label>Select an Image</label>
          <ImageSelector
            query={imageSearchTerm}
            onSelect={(url) => {
              const highRes = url.includes('images.unsplash.com')
                ? `${url.replace(/w=\d+/, 'w=800')}&auto=format`
                : url;
              setImageUrl(highRes);
            }}
          />
        </div>

        {imageUrl && (
          <div className="form-group full">
            <label>Selected Image Preview</label>
            <img src={imageUrl} alt="Selected" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
        )}

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
