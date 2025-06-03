// src/Components/TopPerformers.tsx
import '../Style/TopPerformers.css';
import { Link } from 'react-router-dom';

const mockPerformers = [
  {
    id: 1,
    name: 'John Smith',
    avatar: '/avatars/john.png',
    totalWins: 5,
    currentStreak: 3,
    eventsAttended: 12,
    points: 1221,
  },
  {
    id: 2,
    name: 'David Beckham',
    avatar: '/avatars/david.png',
    totalWins: 4,
    currentStreak: 2,
    eventsAttended: 9,
    points: 938,
  },
  {
    id: 3,
    name: 'Raphaël Junior',
    avatar: '/avatars/raphael.png',
    totalWins: 3,
    currentStreak: 2,
    eventsAttended: 8,
    points: 878,
  },
  {
    id: 4,
    name: 'Jana Roberts',
    avatar: '/avatars/jana.png',
    totalWins: 3,
    currentStreak: 1,
    eventsAttended: 6,
    points: 865,
  },
  {
    id: 5,
    name: 'Jessy James',
    avatar: '/avatars/jessy.png',
    totalWins: 2,
    currentStreak: 1,
    eventsAttended: 6,
    points: 432,
  },
];

const TopPerformers = () => {
  return (
    <section className="top-performers-section">
      <h2 className="leaderboard-title">TOP PERFORMERS THIS WEEK 🏆</h2>

<div className="leaderboard-container">
  {mockPerformers.map((user, index) => {
    const isFirst = index === 0;
    return (
      <div key={user.id + '-container'}>
        {/* First place card */}
        <div className={`leaderboard-card ${isFirst ? 'first-place' : ''}`}>
          <div className="rank">#{index + 1}</div>
          <img className="avatar" src={user.avatar} alt={user.name} />
          <div className="info">
            <h3>{user.name}</h3>
            <p>
              Total Wins: {user.totalWins} &nbsp; | &nbsp;
              Current Streak: {user.currentStreak} &nbsp; | &nbsp;
              Events Attended: {user.eventsAttended}
            </p>
          </div>
          <div className="points">{user.points} POINTS</div>
          <Link to={`/profile/${user.id}`} className="profile-button">
            View Profile
          </Link>
        </div>

        {/* ➕ ADD divider line ONLY after first card */}
        {index === 0 && <div className="devider2"></div>}
      </div>
    );
  })}
</div>

    </section>
  );
};

export default TopPerformers;
