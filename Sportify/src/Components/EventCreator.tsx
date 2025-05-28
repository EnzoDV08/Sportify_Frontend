import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EventCard {
  title: string
  description: string
  date: string
  location: string
  type: 'public' | 'private'
  sport: string
  imageUrl: string
  adminId: string
}

const sports = ['Tennis', 'Basketball', 'Swimming', 'Football', 'Running', 'Paddle Boarding']

const EventCreator = () => {
  const [form, setForm] = useState<EventCard>({
    title: '',
    description: '',
    location: '',
    date: '',
    type: 'public',
    sport: 'Tennis',
    imageUrl: '',
    adminId: ''
  })

  const [mapPreviewUrl, setMapPreviewUrl] = useState('')
  const [imageOption, setImageOption] = useState<'upload' | 'auto'>('upload')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [createdEvents, setCreatedEvents] = useState<EventCard[]>([])

  const updateSportImage = (sport: string) => {
    if (imageOption === 'auto') {
      const tag = sport.toLowerCase().replace(' ', '+')
      const url = `https://source.unsplash.com/600x400/?${tag},sport`
      setForm(prev => ({ ...prev, sport, imageUrl: url }))
    } else {
      setForm(prev => ({ ...prev, sport }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const applyMapPreview = () => {
    if (form.location.trim()) {
      const encoded = encodeURIComponent(form.location)
      const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${encoded}&zoom=14&size=600x200&key=YOUR_GOOGLE_MAPS_API_KEY`
      setMapPreviewUrl(staticMap)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreatedEvents(prev => [...prev, { ...form }])
    setSuccess(`Event "${form.title}" created successfully ✅`)
    setError('')
    setForm({
      title: '',
      description: '',
      location: '',
      date: '',
      type: 'public',
      sport: 'Tennis',
      imageUrl: '',
      adminId: ''
    })
    setMapPreviewUrl('')
    setImageOption('upload')
  }

  const dummyUsers = [
    { name: 'Alice', avatar: '/avatar1.jpg' },
    { name: 'Bob', avatar: '/avatar2.jpg' },
    { name: 'Charlie', avatar: '/avatar3.jpg' },
    { name: 'Diana', avatar: '/avatar4.jpg' }
  ]

  return (
    <div className="text-white px-4 max-w-[1700px] mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left: Create Form */}
        <div className="w-full lg:w-[640px] bg-[#1c1c1c] p-8 rounded-2xl shadow space-y-6">
          <h2 className="text-3xl font-bold text-[#FF9900]">📅 Create a New Event</h2>
          {success && <motion.p className="text-green-400 font-semibold">{success}</motion.p>}
          {error && <p className="text-red-400 font-semibold">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input input-bordered w-full" placeholder="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <div className="flex gap-2">
              <input className="input input-bordered w-full" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              <button type="button" onClick={applyMapPreview} className="btn bg-[#FF9900] hover:bg-orange-500 text-white">Apply</button>
            </div>
            {mapPreviewUrl && <img src={mapPreviewUrl} alt="Map Preview" className="rounded-md w-full h-40 object-cover" />}
            <textarea className="textarea textarea-bordered w-full" placeholder="Event Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            <input type="datetime-local" className="input input-bordered w-full" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <select className="select select-bordered w-full" value={form.sport} onChange={e => updateSportImage(e.target.value)}>
              {sports.map(s => <option key={s}>{s}</option>)}
            </select>

            <div className="flex gap-4">
              <label className="text-white flex gap-2">
                <input type="radio" name="imgOpt" value="upload" checked={imageOption === 'upload'} onChange={() => setImageOption('upload')} />
                Upload Image
              </label>
              <label className="text-white flex gap-2">
                <input type="radio" name="imgOpt" value="auto" checked={imageOption === 'auto'} onChange={() => { setImageOption('auto'); updateSportImage(form.sport) }} />
                Auto Image
              </label>
            </div>

            {imageOption === 'upload' && (
              <>
                <label className="text-sm text-gray-400">📁 Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full" />
              </>
            )}

            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-600" />}

            <select className="select select-bordered w-full" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'public' | 'private' })}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <input type="number" placeholder="Admin ID" className="input input-bordered w-full" value={form.adminId} onChange={e => setForm({ ...form, adminId: e.target.value })} required />

            <button className="btn bg-[#FF9900] hover:bg-orange-500 text-white w-full">Create Event</button>
          </form>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[2px] bg-gray-300 h-full mx-2"></div>

        {/* Right: Upcoming Events */}
        <div className="flex-1 bg-white p-6 shadow space-y-6 max-w-[950px]">
          <h2 className="text-3xl font-bold text-[#DD8100] flex items-center gap-2">📢 Upcoming Events</h2>
          <AnimatePresence>
            {createdEvents.length === 0 ? (
              <motion.p className="text-gray-400 text-center">No events created yet.</motion.p>
            ) : (
              createdEvents.map((event, idx) => {
                const visibleUsers = dummyUsers.slice(0, 3)
                const extraUsers = dummyUsers.length - visibleUsers.length

                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.05 }}
                    className="w-full flex items-center bg-white border border-gray-300 overflow-hidden shadow-md"
                  >
                    {/* Left Image */}
                    <img src={event.imageUrl} alt="event" className="w-[180px] h-[140px] object-cover" />

                    {/* Middle Section */}
                    <div className="flex-1 px-4 py-3 flex flex-col justify-between gap-1">
                      <div>
                        <h3 className="text-lg font-bold text-[#DD8100]">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>

                      {/* Divider line */}
                      <hr className="border-gray-300 my-2" />

                      <p className="text-sm text-gray-800">{event.description}</p>

                      {/* Hosted and Users */}
                      <div className="flex items-center gap-6 mt-2">
                        {event.adminId && (
                          <div className="flex items-center gap-2">
                            <img src="/bearded-logo.png" alt="Bearded" className="w-5 h-5" />
                            <span className="text-xs font-semibold text-gray-700">HOSTED BY BEARDED</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          {visibleUsers.map((user, i) => (
                            <img key={i} src={user.avatar} className="w-6 h-6 rounded-full -ml-2 first:ml-0 border" />
                          ))}
                          {extraUsers > 0 && (
                            <span className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center ml-1">
                              +{extraUsers}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meta Info Right Divider */}
                    <div className="w-[1px] h-[80%] bg-gray-300 mx-2"></div>

                    {/* Right Column */}
                    <div className="flex flex-col items-center justify-center px-4 py-4 gap-2">
                      <span className="bg-black text-white px-3 py-1 text-xs uppercase">{event.type}</span>
                      <div className="text-center border px-2 py-1 w-[60px]">
                        <div className="text-[10px] text-gray-500 uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold text-black">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <button className="text-[#DD8100] border border-[#DD8100] px-4 py-1 text-sm hover:bg-[#DD8100] hover:text-white transition cursor-pointer">
                        View
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default EventCreator


