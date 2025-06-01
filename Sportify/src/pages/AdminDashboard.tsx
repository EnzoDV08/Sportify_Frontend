import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCreator from '../Components/EventCreator'
import PastEventsTable from '../Components/PastEventsTable'
import bannerImage from '../assets/admin-banner.png'
import AdminLogo from '../assets/AdminLogo.svg'
import { fetchAdminDetails } from '../services/api'
import { Admin } from '../models/admin'

const AdminDashboard = () => {
  const [tab, setTab] = useState('achievements')
  const [admin, setAdmin] = useState<Admin | null>(null)

const tabs = [
  { id: 'achievements', label: '🏆 Achievements' },
  { id: 'create', label: '📅 Create Event' },
  { id: 'events', label: '📂 Past Events' }
]

  useEffect(() => {
    fetchAdminDetails().then(setAdmin).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen text-[#FF9900]">
      <div
        className="w-full h-[420px] relative bg-cover bg-center"
        style={{
          backgroundImage: `url('${bannerImage}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* 👑 Admin Logo + Bearded Title */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#1e1e1e]/60 px-4 py-2 rounded-xl shadow-md backdrop-blur-md">
          <img src={AdminLogo} alt="Admin Logo" className="w-12 h-12" />
          <span className="text-[#FF9900] font-bold text-2xl tracking-wide">Bearded</span>
        </div>

        {/* 👤 Admin Profile Info */}
        {admin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center pt-16"
          >
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FF9900] shadow-2xl bg-black">
              <img
                src={admin.profileImage || 'https://via.placeholder.com/150'}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-4xl font-extrabold mt-5 text-white">{admin.name}</h2>
            <p className="text-[#FF9900] text-xl font-semibold mt-1">ID: {admin.adminId}</p>
            <p className="text-gray-300 text-lg mt-1">{admin.email}</p>
          </motion.div>
        )}
      </div>

      {/* 🔘 Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <div className="flex gap-4 bg-[#1e1e1e] rounded-full p-3 shadow-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                tab === t.id
                  ? 'bg-[#FF9900] text-white shadow-md'
                  : 'bg-[#2a2a2a] hover:bg-[#333] text-gray-400'
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 🧾 Tab Content */}
      <div className="px-6 pt-20 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
          {tab === 'create' && <EventCreator />}
          {tab === 'events' && <PastEventsTable />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AdminDashboard

















