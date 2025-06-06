import { useEffect, useState, Fragment } from 'react'
import { Event } from '../models/event'
import { User } from '../models/user'
import { motion, AnimatePresence } from 'framer-motion'
import { assignAchievement, fetchProfile, unassignAchievement } from '../services/api'
import { fetchEvents, fetchAllAchievements } from '../services/api'
import { FullAchievement } from '../models/achievement';




interface UserWithRole extends User {
  role?: string
}

interface MockEvent extends Event {
  participants: UserWithRole[];
  sportType: string;
  status: 'Completed' | 'Upcoming'; 
  creatorId?: number;
}

interface UserProfile {
  profilePicture: string | null;
  favoriteSports?: string;
  bio?: string;
}




const ProfilePicture = ({ userId }: { userId: number }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/Profiles/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(`Failed to fetch profile for user ${userId}`, err);
      }
    };
    fetchProfile();
  }, [userId]);

  return profile?.profilePicture ? (
    <img
      src={`${baseUrl}/${profile.profilePicture}`}
      alt="Profile"
      className="w-10 h-10 rounded-full border border-gray-600 object-cover"
    />
  ) : (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white border border-gray-500 shadow-inner">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5Z" />
      </svg>
    </div>
  );
};



const PastEventsTable = () => {
  const adminId = Number(localStorage.getItem('userId'));
  const [events, setEvents] = useState<MockEvent[]>([])
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null)
  const [searches, setSearches] = useState<Record<number, string>>({})
  const [roleFilters] = useState<Record<number, string>>({})
  const [sportFilter, setSportFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [globalSearch, setGlobalSearch] = useState('')
  const [selectedAchievements, setSelectedAchievements] = useState<Record<number, string>>({})
  const [assigned, setAssigned] = useState<Record<number, boolean>>({})
  const [sortAsc, setSortAsc] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [selectedUserToRemove, setSelectedUserToRemove] = useState<{ eventId: number; userId: number } | null>(null);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [allAchievements, setAllAchievements] = useState<FullAchievement[]>([]);
  const [userPoints, setUserPoints] = useState<Record<number, number>>({});







  

useEffect(() => {
 const loadEventsAndAchievements = async () => {
  try {
    const allEvents = await fetchEvents();
    const achievements = await fetchAllAchievements();

    const pastEvents = allEvents
      .filter(event =>
        event.creatorUserId === 2 &&
        new Date(event.endDateTime) < new Date()
      )
      .map(event => ({
        ...event,
        sportType: event.sportType || 'General',
        participants: event.participants || [],
        status: 'Completed',
      })) as MockEvent[];

    // 🌟 Get points for each participant
    const pointsMap: Record<number, number> = {};
    for (const event of pastEvents) {
      for (const user of event.participants) {
        if (!pointsMap[user.userId]) {
          const profile = await fetchProfile(user.userId);
          pointsMap[user.userId] = profile.totalPoints;
        }
      }
    }

    setUserPoints(pointsMap);
    setEvents(pastEvents);
    setAllAchievements(achievements);
  } catch (err) {
    console.error('❌ Failed to load data:', err);
  }
};

  loadEventsAndAchievements();
}, []);




const userIdString = localStorage.getItem('userId');
const awardedByUserId = userIdString ? Number(userIdString) : 0;




  const toggleExpand = (eventId: number) => {
    setExpandedEventId(prev => (prev === eventId ? null : eventId))
  }

  const handleSearchChange = (eventId: number, value: string) => {
    setSearches(prev => ({ ...prev, [eventId]: value }))
  }

  
    const filterEvents = (events: MockEvent[], query: string) => {
    const q = query.toLowerCase();
    return events.filter(e => {
        const matchesQuery = (
        e.title.toLowerCase().includes(q) ||
        e.sportType.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
        );
        const matchesSport = !sportFilter || e.sportType === sportFilter;
        const matchesDate = !dateFilter || new Date(e.startDateTime).toISOString().split('T')[0] === dateFilter;

        return matchesQuery && matchesSport && matchesDate;
    });
    };


  const filteredParticipants = (eventId: number, participants: UserWithRole[]) => {
    const query = searches[eventId]?.toLowerCase() || ''
    const role = roleFilters[eventId]
    return participants.filter(
      u =>
        (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) &&
        (!role || u.role === role)
    )
  }

const getAchievementsForSport = (sportType: string) => {
  console.log('📌 getAchievementsForSport:', sportType, allAchievements);

  return allAchievements.filter(
    a =>
      !a.isAutoGenerated && // ⛔ exclude auto-generated
      a.sportType.toLowerCase() === sportType.toLowerCase()
  );
};


const handleAssign = async (userId: number, eventId: number) => {
  const isAlreadyAssigned = assigned[userId];
  const rawValue = selectedAchievements[userId];
  const achievementId = Number(rawValue);
  const achievement = allAchievements.find(a => a.achievementId === achievementId);

  if (!achievement) {
    alert('❌ Achievement not found.');
    return;
  }

  try {
    if (isAlreadyAssigned) {
      await unassignAchievement(userId, achievementId, eventId);

      setAssigned(prev => ({ ...prev, [userId]: false }));
      setUserPoints(prev => ({
        ...prev,
        [userId]: (prev[userId] || 0) - achievement.points,
      }));
    } else {
      await assignAchievement({
        userId,
        achievementId,
        eventId,
        awardedByUserId,
      });

      setAssigned(prev => ({ ...prev, [userId]: true }));
      setUserPoints(prev => ({
        ...prev,
        [userId]: (prev[userId] || 0) + achievement.points,
      }));
      setSelectedAchievements(prev => ({ ...prev, [userId]: '' }));
    }
  } catch (err) {
    console.error(err);
    alert('❌ Failed to update achievement.');
  }
};







  const handleRemoveUser = (eventId: number, userId: number) => {
    setEvents(prev =>
      prev.map(e =>
        e.eventId === eventId
          ? { ...e, participants: e.participants.filter(p => p.userId !== userId) }
          : e
      )
    )
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(e => e.eventId !== eventId))
  }

  const completedEvents = events.filter(e => e.status === 'Completed' && e.creatorUserId === adminId);
  const recentEvents = completedEvents.filter(e => new Date(e.startDateTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  

  const renderEventTable = (data: MockEvent[], title: string, headerColor: string) => (
    <div className="mt-10">
      <h2 className={`text-2xl font-bold mb-4 ${headerColor === '#DD8100' ? 'text-[#dd8100e8]' : 'text-[#BB6E00]'}`}>
        {title}
      </h2>

      <div className="overflow-x-auto  bg-[#1b1b1b] shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
        <table className="w-full table-fixed text-sm text-left">
          <thead className={`text-white text-[15px]`} style={{ backgroundColor: headerColor }}>
            <tr>
              <th className="p-3 w-16"></th> 
              <th className="p-3 w-16">ID</th>
              <th className="p-3">Event</th>
              <th className="p-3">Sport</th>
              <th className="p-3">Date</th>
              <th className="p-3">Location</th>
              <th className="p-3">Participants</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="bg-[#202020]"> 
            {filterEvents(data, globalSearch).map(event => (
              <Fragment key={event.eventId}>
                <tr className="border-b border-gray-700 hover:bg-[#2a2a2a]">
                    <td className="p-3">
                        <button
                        className="btn btn-xs btn-ghost text-white"
                        onClick={() => toggleExpand(event.eventId)}
                        >
                        {expandedEventId === event.eventId ? '▲' : '▼'}
                        </button>
                    </td>
                  <td className="p-3 font-medium">{event.eventId}</td>
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{event.sportType}</td>
                  <td className="p-3">{new Date(event.startDateTime).toLocaleString()}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">{event.participants.length}</td>
                  <td className="p-3">{event.status}</td>
                    <td className="p-3 text-center">
                        <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => {
                            setEventToDelete(event.eventId);
                            setShowDeleteEventModal(true);
                            }}
                        >
                            ❌ Delete
                        </button>

                    </td>
                </tr>

<AnimatePresence>
  {expandedEventId === event.eventId && (
    <motion.tr layout>
      <td colSpan={9} className="p-0">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="overflow-hidden bg-[#2a2a2a] border-t border-gray-700"
        >
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="🔍 Search participants..."
                className="input input-sm input-bordered w-64 bg-[#3a3a3a] text-white"
                value={searches[event.eventId] || ''}
                onChange={e => handleSearchChange(event.eventId, e.target.value)}
              />
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="btn btn-xs btn-outline btn-primary"
              >
                Sort Name {sortAsc ? '↑' : '↓'}
              </button>
            </div>

            <table className="table w-full mt-3 text-white border border-gray-600">
              <thead className="bg-[#383838] text-white">
              <tr>
                <th>Img</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Achievement</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>

              <tbody>
  <AnimatePresence mode="sync">
    {filteredParticipants(event.eventId, event.participants)
      .sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      )
      .map(user => (
        <motion.tr
          key={`${event.eventId}-${user.userId}`}
          layout
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="hover:bg-[#444]"
        >
          <td>{user.userId}</td>
<td>
  <ProfilePicture userId={user.userId} />
</td>


          <td>{user.name}</td>
          <td>{user.email}</td>
         <td>
  <div className="flex items-center gap-2 justify-start">
    <select
      disabled={assigned[user.userId]}
      className="select select-xs select-bordered w-36 bg-[#1a1a1a] text-white"
      value={selectedAchievements[user.userId] || ''}
      onChange={e => {
  console.log('🟢 Selected achievement for user', user.userId, ':', e.target.value);
  setSelectedAchievements(prev => ({
    ...prev,
    [user.userId]: e.target.value
  }));
}}
    >
      <option disabled value="">🏅 Assign Achievement...</option>
{getAchievementsForSport(event.sportType).map(a => {
  console.log("🎖️ Rendering achievement option:", a);
  return (
    <option key={`ach-${a.achievementId}-${a.title}`} value={a.achievementId}>
      {a.title} (+{a.points})
    </option>
  );
})}


    </select>

    <button
    
      onClick={() => handleAssign(user.userId, event.eventId)}
      className={`btn btn-xs ${assigned[user.userId] ? 'btn-error' : 'btn-success'}`}
    >
      {assigned[user.userId] ? 'Undo' : 'Assign'}
    </button>
  </div>
</td>
<td className="text-sm text-green-400 font-semibold">
  🏆 {calculateUserPoints(user.userId)} pts
</td>

          <td>
            <button
              onClick={() => {
                setSelectedUserToRemove({
                  eventId: event.eventId,
                  userId: user.userId
                });
                setTimeout(() => setShowModal(true), 10);
              }}
              className="btn btn-xs btn-outline btn-error"
            >
              Remove
            </button>
          </td>
        </motion.tr>
      ))}
  </AnimatePresence>
</tbody>

            </table>
          </div>
        </motion.div>
      </td>
    </motion.tr>
  )}
</AnimatePresence>

              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

const calculateUserPoints = (userId: number): number => {
  return userPoints[userId] || 0;
};


return (
  <div className="space-y-14 px-6 pb-16 text-white min-h-screen">
    {/* Filter Bar */}
<div className="bg-[#1e1e1e] p-4  shadow-lg flex flex-col md:flex-row items-center gap-4 justify-between max-w-6xl mx-auto mt-10 -mb-3 ">
  <input
    type="text"
    placeholder="🔍 Search title, sport, location..."
    className="input input-sm input-bordered w-full md:max-w-sm bg-[#3a3a3a] text-white placeholder:text-gray-400"
    value={globalSearch}
    onChange={(e) => setGlobalSearch(e.target.value)}
  />
  <select
    className="select select-sm bg-[#3a3a3a] text-white w-full md:w-48"
    value={sportFilter}
    onChange={(e) => setSportFilter(e.target.value)}
  >
    <option value="">All Sports</option>
    <option value="Soccer">Soccer</option>
    <option value="Football">Football</option>
    <option value="Basketball">Basketball</option>
    <option value="Running">Running</option>
    <option value="Swimming">Swimming</option>
  </select>
  <input
    type="date"
    className="input input-sm input-bordered bg-[#3a3a3a] text-white w-full md:w-48"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
  />
</div>


    {renderEventTable(recentEvents, '📌 Recently Completed Events', '#DD8100')}
   

    {showModal && (
  <dialog className="modal modal-open">
    <div className="modal-box bg-[#1c1c1c] text-white border border-gray-600">
      <h3 className="font-bold text-lg text-red-500">⚠ Confirm Removal</h3>
      <p className="py-4">Are you sure you want to remove this user from the event?</p>
      <div className="modal-action">
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            if (selectedUserToRemove) {
              handleRemoveUser(selectedUserToRemove.eventId, selectedUserToRemove.userId)
              setShowModal(false)
              setSelectedUserToRemove(null)
            }
          }}
        >
          Yes, Remove
        </button>
        <button className="btn btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </dialog>
)}
{showDeleteEventModal && (
  <dialog className="modal modal-open">
    <div className="modal-box bg-[#1c1c1c] text-white border border-gray-600">
      <h3 className="font-bold text-lg text-red-500">🗑️ Confirm Event Deletion</h3>
      <p className="py-4">Are you sure you want to permanently delete this event?</p>
      <div className="modal-action">
        <button
          className="btn btn-sm btn-error"
          onClick={() => {
            if (eventToDelete !== null) {
              handleDeleteEvent(eventToDelete);
              setShowDeleteEventModal(false);
              setEventToDelete(null);
            }
          }}
        >
          Yes, Delete
        </button>
        <button className="btn btn-sm" onClick={() => setShowDeleteEventModal(false)}>
          Cancel
        </button>
      </div>
    </div>
  </dialog>
)}

  </div>
  
  
)


}

export default PastEventsTable







