import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/TopPerformers.css';

interface Profile {
  userId: number;
  profilePicture?: string;
  name: string;
  totalPoints: number;
  totalWins?: number;
  currentStreak?: number;
  eventsAttended?: number;
}

const TopPerformers = () => {
  const [performers, setPerformers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/Profiles`);
        if (!res.ok) throw new Error('Failed to load profiles');
        const data: Profile[] = await res.json();

        const sorted = data
          .filter((p) => typeof p.totalPoints === 'number')
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 5);

        setPerformers(sorted);
      } catch (err) {
        console.error('❌ Failed to fetch top performers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner text-orange-500 loading-lg"></span>
      </div>
    );
  }

  if (performers.length === 0) return null;

  return (
    <section className="top-performers-section">
      <h2 className="leaderboard-title">TOP PERFORMERS THIS WEEK 🏆</h2>

      <div className="leaderboard-container">
        {performers.map((user, index) => {
          const isFirst = index === 0;
          return (
            <div key={user.userId}>
              <div className={`leaderboard-card ${isFirst ? 'first-place' : ''}`}>
                <div className="rank">#{index + 1}</div>

                {user.profilePicture ? (
                  <img
                    className="avatar"
                    src={`${baseUrl}/${user.profilePicture}`}
                    alt={user.name}
                  />
                ) : (
                  <div className="avatar fallback-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <div className="info">
                  <h3>{user.name}</h3>
                  <p>
                    Total Wins: {user.totalWins ?? 0} &nbsp; | &nbsp;
                    Streak: {user.currentStreak ?? 0} &nbsp; | &nbsp;
                    Events: {user.eventsAttended ?? 0}
                  </p>
                </div>

                <div className="points">{user.totalPoints} POINTS</div>

                <Link to={`/profile/${user.userId}`} className="profile-button">
                  View Profile
                </Link>
              </div>

              {index === 0 && <div className="devider2"></div>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopPerformers;
