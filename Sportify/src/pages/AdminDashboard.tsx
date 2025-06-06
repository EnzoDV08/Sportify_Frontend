import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCreator from '../Components/EventCreator'
import PastEventsTable from '../Components/PastEventsTable'
import bannerImage from '../assets/admin-banner.png'
import AdminLogo from '../assets/AdminLogo.svg'


const AdminDashboard = () => {
  const [tab, setTab] = useState('create')



const tabs = [
  { id: 'create', label: '📅 Create Event' },
  { id: 'events', label: '📂 Past Events' }
]


  return (

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



      {/* 🔘 Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6"
      >
        <div className="flex gap-4 bg-[#1e1e1e] rounded-full p-3 shadow-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`px-7 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
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
      <div className="px-6 pt-10 pb-20">
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

















