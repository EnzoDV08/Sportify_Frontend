import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSingleEvent, updateEvent } from '../services/api';
import { Event } from '../models/event';
import ImageSelector from '../Components/ImageSelector';
import '../Style/CreateEvent.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageSearchTerm, setImageSearchTerm] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchSingleEvent(Number(id))
      .then(setEventData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData) return;

    const cleanedImageUrl = eventData.imageUrl?.includes('images.unsplash.com')
      ? `${eventData.imageUrl.replace(/w=\d+/, 'w=1200')}&auto=format`
      : eventData.imageUrl;

    try {
      const updated = {
        ...eventData,
        imageUrl: cleanedImageUrl,
      };

      await updateEvent(updated.eventId, updated);

      toast.success('Event updated successfully!', {
        style: {
          background: 'linear-gradient(to right, #28a745, #56d679)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 20px',
          textAlign: 'center',
          width: '100%',
        },
      });

      setTimeout(() => {
        navigate(`/events/${updated.eventId}`);
      }, 2600);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update event.', {
        style: {
          background: 'linear-gradient(to right, #d9534f, #e57373)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '12px 20px',
          textAlign: 'center',
          width: '100%',
        },
      });
    }
  };

  if (loading || !eventData) {
    return (
      <div className="all-events-page event-loading-container">
        <Circles
          height="80"
          width="80"
          color="#ff9100"
          ariaLabel="loading-events"
        />
        <p className="loading-message">Loading... because good things take time.</p>
      </div>
    );
  }
  return (
    <div className="create-event-container">
      <form className="create-event-form" onSubmit={handleSubmit}>
        <h2>Edit Event</h2>

        <div className="form-group full">
          <label>Title</label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
          />
        </div>

        <div className="form-group half">
          <label>Start Date & Time</label>
          <input
            type="datetime-local"
            value={eventData.startDateTime.slice(0, 16)}
            onChange={(e) => setEventData({ ...eventData, startDateTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group half">
          <label>End Date & Time</label>
          <input
            type="datetime-local"
            value={eventData.endDateTime.slice(0, 16)}
            onChange={(e) => setEventData({ ...eventData, endDateTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group full">
          <label>Required Items</label>
          <input
            type="text"
            value={eventData.requiredItems}
            onChange={(e) => setEventData({ ...eventData, requiredItems: e.target.value })}
            placeholder="e.g. Water bottle, Shoes"
          />
        </div>

        <div className="form-group full">
          <label>Location</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            required
          />
        </div>

        <div className="form-group half">
          <label>Type</label>
          <select
            value={eventData.type}
            onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
            required
          >
            <option value="">Select type</option>
            <option value="training">Training</option>
            <option value="match">Match</option>
            <option value="meetup">Meetup</option>
          </select>
        </div>

        <div className="form-group half">
          <label>Visibility</label>
          <select
            value={eventData.visibility}
            onChange={(e) => setEventData({ ...eventData, visibility: e.target.value })}
            required
          >
            <option value="">Select visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="form-group full">
          <label>Image Search Term</label>
          <input
            type="text"
            value={imageSearchTerm}
            onChange={(e) => setImageSearchTerm(e.target.value)}
            placeholder="e.g. basketball, training"
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
              setEventData({ ...eventData, imageUrl: highRes });
            }}
          />
        </div>

        {eventData.imageUrl && (
          <div className="form-group full">
            <label>Selected Image Preview</label>
            <img
              src={eventData.imageUrl}
              alt="Selected"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        )}

        <button type="submit">Update Event</button>
      </form>

      <ToastContainer position="top-center" 
      autoClose={2500} 
      hideProgressBar 
      closeButton={false}  />
    </div>
  );
}

export default EditEvent;
