import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createEvent, fetchEventsByUser, updateEvent, deleteEvent } from '../services/api';
import { Event } from '../models/event';
import ImageSelector from '../Components/ImageSelector';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../services/api';



const EventCreator = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: '',
    sportType: '',
    type: 'match',
    visibility: 'public',
    requiredItems: '',
    imageUrl: '',
  });

  const [imageOption, setImageOption] = useState<'upload' | 'auto'>('upload');
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [searchTag, setSearchTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

interface UserProfile {
  profilePicture: string | null;
  favoriteSports?: string;
  bio?: string;
}

const ProfilePicture = ({ userId }: { userId: number }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetch = async () => {
      try {
const res = await fetchProfile(userId);

// Explicitly shape it to match your UserProfile interface
const cleanProfile: UserProfile = {
  profilePicture: res.profilePicture ?? null,
  favoriteSports: res.favoriteSports,
  bio: res.bio,
};

setProfile(cleanProfile);

      } catch (err) {
        console.error('❌ Failed to load profile picture', err);
      }
    };
    fetch();
  }, [userId]);

  return profile?.profilePicture ? (
    <img
      src={`${baseUrl}/${profile.profilePicture}`}
      alt="profile"
      className="w-8 h-8 rounded-full border-2 border-white object-cover"
    />
  ) : (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-black border-2 border-white text-xs font-semibold">
      ?
    </div>
  );
};

  const userId = localStorage.getItem('userId');

 const [loading, setLoading] = useState(true);

useEffect(() => {
  if (userId === '2') {
    fetchEventsByUser(2)
      .then((events: Event[]) => {
        const filtered = events.filter((e) => e.creatorUserId === 2);
        setCreatedEvents(filtered);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError('❌ Could not load your created events.');
      })
      .finally(() => setLoading(false));
  }
}, []);


  const updateAutoImage = (tag: string) => {
    const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(tag || form.type)},sport&sig=${Math.floor(
      Math.random() * 1000
    )}`;
    setForm((prev) => ({ ...prev, imageUrl }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (userId !== '2') return alert('You are not authorized to create events.');

  const dto = {
    title: form.title,
    description: form.description,
    location: form.location,
    startDateTime: form.startDateTime,
    endDateTime: form.endDateTime,
    type: form.type,
    visibility: form.visibility,
    status: 'upcoming',
    requiredItems: form.requiredItems,
    imageUrl: form.imageUrl,
    sportType: form.sportType,
  };

  try {
    if (editingEventId) {
      // ✏️ Edit Mode: Update event
    await updateEvent(editingEventId, dto);

setCreatedEvents((prev) =>
  prev.map(e =>
    e.eventId === editingEventId ? { ...e, ...dto } : e
  )
);

      setSuccess(`✅ "${form.title}" updated!`);
    } else {
      // ➕ Create Mode
      const newEvent: Event = { ...dto, eventId: Date.now(), creatorUserId: 2,  adminId: 2,  };
      await createEvent(dto, 2);
      setCreatedEvents((prev) => [...prev, newEvent]);
      setSuccess(`✅ "${form.title}" created!`);
    }

    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);

    // Reset form
    setForm({ title: '', description: '', location: '', startDateTime: '', endDateTime: '', sportType: '', type: 'match', visibility: 'public', requiredItems: '', imageUrl: '' });
    setSearchTag('');
    setEditingEventId(null); // 🔁 Exit edit mode
  } catch (err) {
    console.error(err);
    setError('❌ Failed to submit event.');
  }
};



  // ⛔ Render nothing if not admin
  if (userId !== '2') {
    return (
      <div className="text-center text-red-400 font-semibold p-10">
        ⛔ You are not authorized to view this page.
      </div>
    );
  }

const handleDelete = async (eventId: number) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      // Replace with your API call if needed:
      await deleteEvent(eventId); // ✅ Backend delete
setCreatedEvents(prev => prev.filter(e => e.eventId !== eventId));

    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  }
};


  return (
   <div className="text-white px-4 max-w-[1600px] mx-auto py-10 flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left: Admin Form */}
      <div className="w-full lg:w-[600px] bg-[#1c1c1c] p-6 rounded-xl space-y-4 shadow-lg h-fit lg:sticky lg:top-10 self-start">
        <h2 className="text-2xl font-bold text-[#FF9900]">🛠️ Admin Create Event</h2>
       {showSuccessModal && (
  <dialog className="modal modal-open">
    <div className="modal-box bg-[#1c1c1c] text-white border border-gray-600">
      <h3 className="font-bold text-lg text-green-400">
        {success.includes('created') ? '🎉 Event Created' : '✅ Success'}
      </h3>
      <p className="py-4">{success}</p>
      <div className="modal-action">
        <button className="btn btn-sm btn-primary" onClick={() => setShowSuccessModal(false)}>
          OK
        </button>
      </div>
    </div>
  </dialog>
)}

        {error && <p className="text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input input-bordered w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-sm text-white">Start Date & Time</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={form.startDateTime}
                onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <label className="text-sm text-white">End Date & Time</label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={form.endDateTime}
                onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
                required
              />
            </div>
          </div>

          <input
            className="input input-bordered w-full"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <input
            className="input input-bordered w-full"
            placeholder="Required Items"
            value={form.requiredItems}
            onChange={(e) => setForm({ ...form, requiredItems: e.target.value })}
          />

          <select
            className="select select-bordered w-full"
            value={form.sportType}
            onChange={(e) => setForm({ ...form, sportType: e.target.value })}
            required
          >
            <option value="">Select Sport</option>
            <option value="Soccer">Soccer</option>
            <option value="Rugby">Rugby</option>
            <option value="Running">Running</option>
            <option value="Swimming">Swimming</option>
            <option value="Basketball">Basketball</option>
            <option value="Cricket">Cricket</option>
            <option value="Tennis">Tennis</option>
            <option value="Golf">Golf</option>
            <option value="Table Tennis">Table Tennis</option>
            <option value="Yoga">Yoga</option>
          </select>

          <div className="flex gap-3">
            <select
              className="select select-bordered w-full"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="match">Match</option>
              <option value="training">Training</option>
              <option value="meetup">Meetup</option>
            </select>

            <select
              className="select select-bordered w-full"
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Image Handling */}
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageOption"
                checked={imageOption === 'upload'}
                onChange={() => setImageOption('upload')}
              />
              Upload Image
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageOption"
                checked={imageOption === 'auto'}
                onChange={() => {
                  setImageOption('auto');
                  updateAutoImage(searchTag);
                }}
              />
              Auto Image
            </label>
          </div>
          {imageOption === 'upload' ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
            />
          ) : (
            <>
              <input
                className="input input-bordered w-full"
                placeholder="Search term e.g. soccer"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
              />
              <ImageSelector
                query={searchTag}
                onSelect={(url) => {
                  const cleanedUrl = url.includes('images.unsplash.com')
                    ? `${url.replace(/w=\d+/, 'w=800')}&auto=format`
                    : url;
                  setForm((prev) => ({ ...prev, imageUrl: cleanedUrl }));
                }}
              />
            </>
          )}


          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-md border"
            />
          )}

<button type="submit" className="btn bg-[#FF9900] text-white w-full">
  {editingEventId ? 'Update Event' : 'Create Event'}
</button>

        </form>
        {editingEventId && (
  <button
    type="button"
    className="btn btn-outline btn-sm text-red-400 w-full"
    onClick={() => {
      setForm({ title: '', description: '', location: '', startDateTime: '', endDateTime: '', sportType: '', type: 'match', visibility: 'public', requiredItems: '', imageUrl: '' });
      setEditingEventId(null);
    }}
  >
    ❌ Cancel Edit
  </button>
)}

      </div>

      {/* Right: Created Events */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow space-y-4 max-w-[900px]">
        <h2 className="text-2xl font-bold text-[#DD8100]">📢 Created Events</h2>
        {loading && (
  <div className="flex justify-center items-center py-10">
    <span role="status" className="loading loading-spinner text-orange-500 loading-lg"></span>
  </div>
)}

        <AnimatePresence>
          {createdEvents.length === 0 ? (
            <motion.p className="text-gray-500">No events created yet.</motion.p>
          ) : (
            
            createdEvents.map((event, i) => (
           <motion.div
  key={i}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="w-full bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition duration-300 flex flex-col md:flex-row overflow-hidden"
>
  {/* LEFT: Image */}
  <img
    src={event.imageUrl || '/placeholder.jpg'}
    alt={event.title}
    className="w-full md:w-[220px] h-[150px] md:h-auto object-cover"
  />

  {/* MIDDLE: Info Content */}
  <div className="flex flex-col justify-between p-4 flex-1">
    <div>
      <h3 className="text-xl font-bold text-[#FF9900] mb-1">{event.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p>📍 <span className="font-medium text-black">{event.location}</span></p>
        <p>🏅 Sport: {event.sportType}</p>
        <p>👤 Creator ID: {event.creatorUserId}</p>
      </div>
    </div>

    {/* HOST + PARTICIPANTS */}
    <div className="mt-3 flex flex-wrap items-center justify-between">
      <div className="flex items-center space-x-2">
<img
  src="/AdminLogo.png"
  alt="Bearded Logo"
  className="w-6 h-6 object-contain"
/>
  <span className="text-xs font-semibold text-black uppercase">Hosted by Bearded</span>
</div>


      <div className="flex items-center -space-x-2 mt-1 md:mt-0">
        {event.participants?.slice(0, 5).map((p, i) => (
          <div key={p.userId} style={{ zIndex: 10 - i }}>
            <ProfilePicture userId={p.userId} />
          </div>
        ))}
        {event.participants && event.participants.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-semibold flex items-center justify-center border-2 border-white z-0">
            +{event.participants.length - 5}
          </div>
        )}
      </div>
    </div>
  </div>

  {/* RIGHT: Date & Actions */}
  <div className="flex flex-col justify-between items-center px-4 py-3 bg-gray-100 border-l border-gray-300 min-w-[100px] text-center">
    <div>
      <p className="text-sm font-bold text-gray-600 uppercase">{new Date(event.startDateTime).toLocaleString('en-US', { month: 'short' })}</p>
      <p className="text-2xl font-extrabold text-black">{new Date(event.startDateTime).getDate()}</p>
      <p className="text-xs text-gray-600 mt-1">
        {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -<br />
        {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>

    <div className="mt-4 space-y-1 w-full">
      <button
        className="btn btn-xs btn-outline btn-error w-full  !text-black"
        onClick={() => handleDelete(event.eventId)}
      >
        ❌ Delete
      </button>
      <button
        className="btn btn-xs btn-outline btn-warning w-full  !text-black"
        onClick={() => {
          setEditingEventId(event.eventId);
          setForm({
            title: event.title || '',
            description: event.description || '',
            location: event.location || '',
            startDateTime: event.startDateTime ? new Date(event.startDateTime).toISOString().slice(0, 16) : '',
            endDateTime: event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 16) : '',
            sportType: event.sportType || '',
            type: event.type || 'match',
            visibility: event.visibility || 'public',
            requiredItems: event.requiredItems || '',
            imageUrl: event.imageUrl || '',
          });
        }}
      >
        ✏️ Edit
      </button>
      <Link to={`/events/${event.eventId}`} className="btn btn-xs btn-outline btn-info w-full !text-black ">
        👁️ View
      </Link>
    </div>
  </div>
</motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventCreator;




