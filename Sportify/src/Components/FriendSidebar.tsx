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
import { FullFriend } from '../models/Friend';
import { RxCross2 } from 'react-icons/rx';
import { PiUsersThreeBold, PiUserPlusBold, PiHandshakeBold } from 'react-icons/pi';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi'; // ✅ NEW icons
import '../Style/FriendSidebar.css';

const FriendSidebar = ({ className = '', onClose }: { className?: string; onClose?: () => void }) => {
    const userId = Number(localStorage.getItem('userId')); // logged-in user

const [friends, setFriends] = useState<FullFriend[]>([]);
const [requests, setRequests] = useState<FullFriend[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState<FullFriend[]>([]);


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
      const results = await searchUsers(searchTerm.trim());
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, 400); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);



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
    setSearchResults(prev => prev.filter(f => f.friend.userId !== receiverId));
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
        src={friend.friend.profilePicture || '/profile.jpg'}
        alt={friend.friend.name}
      />
      <span className="friend-name">{friend.friend.name}</span>
    </div>
    <div className="friend-actions">
      <button className="view-btn small-btn">View</button>
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

{searchResults.map(result => (
  <div key={result.friend.userId} className="search-result">
    <div className="friend-info">
      <img className="friend-avatar" src={result.friend.profilePicture || '/profile.jpg'} alt={result.friend.name} />
      <span className="friend-name">{result.friend.name}</span>
    </div>
    <button
      className="add-btn"
      onClick={() => handleSendRequest(result.friend.userId)}
    >
      Send Request
    </button>
  </div>
))}

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
        src={req.friend.profilePicture || '/profile.jpg'}
        alt={req.friend.name}
      />
      <span className="friend-name">{req.friend.name}</span>
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
