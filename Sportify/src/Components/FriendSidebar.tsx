import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  fetchMyFriends,
  fetchFriendRequests,
  searchUsers,
} from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FullFriend } from '../models/Friend';
import { RxCross2 } from 'react-icons/rx';
import { PiUsersThreeBold, PiUserPlusBold, PiHandshakeBold } from 'react-icons/pi';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext'; // ✅ NEW icons
import '../Style/FriendSidebar.css';

const FriendSidebar = ({ className = '', onClose }: { className?: string; onClose?: () => void }) => {
    const userId = Number(localStorage.getItem('userId')); // logged-in user

const [friends, setFriends] = useState<FullFriend[]>([]);
const [requests, setRequests] = useState<FullFriend[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState<FullFriend[]>([]);
const { addNotification } = useNotification();



useEffect(() => {
  const loadData = async () => {
    try {
      const [myFriends, incoming] = await Promise.all([
        fetchMyFriends(userId),
        fetchFriendRequests(userId)
      ]);
      setFriends(myFriends);
      setRequests(incoming);
    } catch (err) {
      setError('Could not load friends or requests.');
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [userId]);

useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsers(searchTerm.trim(), userId);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, 400); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const updatedRequests = await fetchFriendRequests(userId);
      const newRequests = updatedRequests.filter(r => !requests.some(old => old.id === r.id));

      if (newRequests.length > 0) {
        newRequests.forEach(req => {
          addNotification({
            title: 'New Friend Request',
            message: `You got a request from ${req.user.name}`,
            iconUrl: '/trophy.png',
          });
        });
        setRequests(updatedRequests);
      }
    } catch (err) {
      console.error('Failed to poll friend requests:', err);
    }
  }, 5000); // Every 5s

  return () => clearInterval(interval); // Cleanup
}, [userId, requests]);

const handleAccept = async (id: number) => {
  try {
    await acceptFriendRequest(id);
    setRequests(prev => prev.filter(r => r.id !== id));
    const updated = await fetchMyFriends(userId);
    setFriends(updated);
  } catch (err) {
    console.error('Error accepting friend:', err);
  }
};

const handleDecline = async (id: number) => {
  try {
    await declineFriendRequest(id);
    setRequests(prev => prev.filter(r => r.id !== id));
  } catch (err) {
    console.error('Error declining friend:', err);
  }
};

const handleRemove = async (id: number) => {
  try {
    await removeFriend(id);
    setFriends(prev => prev.filter(f => f.id !== id));
  } catch (err) {
    console.error('Error removing friend:', err);
  }
};

const handleSendRequest = async (receiverId: number) => {
  try {
    await sendFriendRequest({ senderId: userId, receiverId });
    setSearchResults(prev => prev.filter(f => f.user.userId !== receiverId));

    addNotification({
      title: 'Friend Request Sent',
      message: 'Your friend request was sent successfully!',
      iconUrl: '/trophy.png'
    });
  } catch (err) {
    console.error('Failed to send friend request:', err);
  }
};


  return (
    <div className={`friend-sidebar ${className}`}>
      {/* Header */}
      <div className="friend-sidebar-header">
        {loading && <p className="friend-status-msg">Loading friends...</p>}
        {error && <p className="friend-error-msg">{error}</p>}
        <button className="close-btn" onClick={onClose}>
          <RxCross2 size={18} />
        </button>
        <input type="text" className="friend-search" placeholder="Search my friends..." />
      </div>

      {/* === Friends List === */}
      <div className="friend-section">
        <h3 className="section-title">
          <PiUsersThreeBold className="section-icon" /> My Friends
        </h3>

        {friends.map(friend => (
  <div key={friend.id} className="friend-item">
    <div className="friend-info">
      <img
        className="friend-avatar"
        src={
  friend.profile.profilePicture?.startsWith('http')
    ? friend.profile.profilePicture
    : friend.profile.profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${friend.profile.profilePicture}`
    : '/profile.jpg'
}
        alt={friend.user.name}
      />
      <span className="friend-name">{friend.user.name}</span>
    </div>
    <div className="friend-actions">
      <Link to={`/view-profile/${friend.user.userId}`} className="view-btn small-btn">
        View
      </Link>
      <button className="remove-btn" onClick={() => handleRemove(friend.id)}>
        <FiTrash2 size={16} />
      </button>
    </div>
  </div>
))}

      </div>

      {/* === Add Friends === */}
      <div className="friend-section">
        <h3 className="section-title">
          <PiUserPlusBold className="section-icon" /> Add New Friends
        </h3>

<input
  type="text"
  className="friend-search"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

{searchResults.map(result => {
  const isAlreadyFriend = friends.some(f => f.user.userId === result.user.userId);
  const isPending = requests.some(r => r.user.userId === result.user.userId);

  return (
    <div key={result.user.userId} className="search-result">
      <div className="friend-info">
        <img
          className="friend-avatar"
          src={result.profile.profilePicture || '/profile.jpg'}
          alt={result.user.name}
        />
        <span className="friend-name">{result.user.name}</span>
      </div>
      {isAlreadyFriend ? (
        <button className="disabled-btn" disabled>Friend</button>
      ) : isPending ? (
        <button className="disabled-btn" disabled>Pending</button>
      ) : (
        <button className="add-btn" onClick={() => handleSendRequest(result.user.userId)}>
          Send Request
        </button>
      )}
    </div>
  );
})}


      </div>

      {/* === Requests === */}
      <div className="friend-section">
        <h3 className="section-title">
          <PiHandshakeBold className="section-icon" /> Friend Requests
        </h3>

       {requests.map(req => (
  <div key={req.id} className="request-item">
    <div className="friend-info">
      <img
        className="friend-avatar"
        src={req.profile.profilePicture || '/profile.jpg'}
        alt={req.user.name}
      />
      <span className="friend-name">{req.user.name}</span>
    </div>
    <div className="request-actions">
      <button className="accept-btn" onClick={() => handleAccept(req.id)}>
        <FiCheck size={16} />
      </button>
      <button className="decline-btn" onClick={() => handleDecline(req.id)}>
        <FiX size={16} />
      </button>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default FriendSidebar;
