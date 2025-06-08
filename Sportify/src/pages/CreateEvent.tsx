import { useState } from 'react';
import { createEvent } from '../services/api';
import ImageSelector from '../Components/ImageSelector';
import '../Style/CreateEvent.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [requiredItems, setRequiredItems] = useState('');
  const [sportType, setSportType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ userId: number; name: string }[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<{ userId: number; name: string }[]>([]);

  const navigate = useNavigate();

  const searchUsers = async (term: string) => {
    if (!term.trim()) return setSearchResults([]);
    const res = await fetch(`http://localhost:5000/api/users/search?name=${term}`);
    const data = await res.json();
    setSearchResults(data);
  };

  const handleSelectUser = (user: { userId: number; name: string }) => {
    if (!invitedUsers.some((u) => u.userId === user.userId)) {
      setInvitedUsers([...invitedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeInvitedUser = (userId: number) => {
    setInvitedUsers(invitedUsers.filter((u) => u.userId !== userId));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const styles = {
      success: { background: 'linear-gradient(to right, #28a745, #56d679)', color: 'white' },
      error: { background: 'linear-gradient(to right, #d9534f, #e57373)', color: 'white' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return showToast('User not logged in.', 'error');

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
          sportType,
          status: 'upcoming',
          visibility,
          requiredItems,
          imageUrl: cleanedImageUrl,
          invitedUserIds: invitedUsers.map((u) => u.userId),
        },
        userId
      );

      showToast('🎉 Event created successfully!', 'success');
      setTimeout(() => navigate('/events'), 2800);
    } catch (err) {
      console.error(err);
      showToast('Failed to create event.', 'error');
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

        <div className="form-group full">
          <label>Sport Type</label>
          <select value={sportType} onChange={(e) => setSportType(e.target.value)} required>
            <option value="">Select sport</option>
            <option value="Soccer">Soccer</option>
            <option value="Basketball">Basketball</option>
            <option value="Swimming">Swimming</option>
            <option value="Running">Running</option>
            <option value="Rugby">Rugby</option>
            <option value="Cycling">Cycling</option>
            <option value="Karate">Karate</option>
            <option value="Table Tennis">Table Tennis</option>
            <option value="Tennis">Tennis</option>
            <option value="Cricket">Cricket</option>
            <option value="Volleyball">Volleyball</option>
            <option value="Golf">Golf</option>
          </select>
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
          <label>Invite Users</label>
          <input
            type="text"
            placeholder="Type a name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchUsers(e.target.value);
            }}
          />
          {searchResults.length > 0 && (
            <ul className="dropdown-list">
              {searchResults.map((user) => (
                <li
                  key={user.userId}
                  onClick={() => handleSelectUser(user)}
                  style={{ cursor: 'pointer', padding: '4px', backgroundColor: '#3a3a3a', margin: '2px 0' }}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}

          {invitedUsers.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Invited:</strong>
              <ul>
                {invitedUsers.map((user) => (
                  <li key={user.userId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {user.name}
                    <button type="button" onClick={() => removeInvitedUser(user.userId)} style={{ marginLeft: '1rem', color: 'red' }}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeButton={false} />
    </div>
  );
}

export default CreateEvent;
