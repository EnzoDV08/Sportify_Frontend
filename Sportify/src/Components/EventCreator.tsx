import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createEvent, fetchEventsByUser } from '../services/api';
import { Event } from '../models/event';
import ImageSelector from '../Components/ImageSelector';

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

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // ⛔ Only fetch if userId === '2'
    if (userId === '2') {
     fetchEventsByUser(2)
  .then((events: Event[]) => {
    const filtered = events.filter((e) => e.creatorUserId === 2);
    setCreatedEvents(filtered);
  })
  .catch((err: unknown) => {
    console.error(err);
    setError('❌ Could not load your created events.');
  });

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

    // ⛔ Block creation if not admin (userId !== 2)
    if (userId !== '2') {
      return alert('You are not authorized to create events.');
    }

    try {
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

      await createEvent(dto, 2);

      setCreatedEvents((prev) => [
        ...prev,
        { ...dto, creatorUserId: 2, eventId: Date.now() } as Event,
      ]);
      setSuccess(`✅ "${form.title}" created!`);

      setForm({
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
      setSearchTag('');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to create event.');
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


  return (
    <div className="text-white px-4 max-w-[1600px] mx-auto py-10 flex flex-col lg:flex-row gap-6">
      {/* Left: Admin Form */}
      <div className="w-full lg:w-[600px] bg-[#1c1c1c] p-6 rounded-xl space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#FF9900]">🛠️ Admin Create Event</h2>
        {success && <motion.p className="text-green-400">{success}</motion.p>}
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
            Create Event
          </button>
        </form>
      </div>

      {/* Right: Created Events */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow space-y-4 max-w-[900px]">
        <h2 className="text-2xl font-bold text-[#DD8100]">📢 Created Events</h2>
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
                className="flex items-center border border-gray-300 p-4 gap-4"
              >
                <img
                  src={event.imageUrl || '/placeholder.jpg'}
                  alt="event"
                  className="w-[160px] h-[100px] object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#DD8100]">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                  <p className="text-xs text-gray-500">🏅 Sport: {event.sportType}</p>
                  <p className="text-xs text-gray-500">👤 Creator ID: {event.creatorUserId}</p>
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




