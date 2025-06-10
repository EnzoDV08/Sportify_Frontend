import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/TopPerformers.css';

interface ProfileData {
  userId: number;
  profilePicture?: string;
  totalPoints: number;
}

interface UserData {
  name: string;
}

interface TopPerformer extends ProfileData {
  fullName: string;
}

const TopPerformers = () => {
  const [performers, setPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fallback image for missing or broken profile pictures
  const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/profiles`);
        if (!res.ok) throw new Error('Failed to load profiles');
        const profiles: ProfileData[] = await res.json();

        const topProfiles = profiles
          .filter((p) => typeof p.totalPoints === 'number')
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 5);

        const withNames: TopPerformer[] = await Promise.all(
          topProfiles.map(async (profile) => {
            try {
              const res = await fetch(`${baseUrl}/api/users/${profile.userId}`);
              if (!res.ok) throw new Error('User fetch failed');
              const user: UserData = await res.json();
              return { ...profile, fullName: user.name };
            } catch {
              return { ...profile, fullName: 'Unknown User' };
            }
          })
        );

        setPerformers(withNames);
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

                <img
                  className="avatar"
                  src={
                    user.profilePicture
                      ? `${baseUrl}/${user.profilePicture}`
                      : fallbackImage
                  }
                  alt={user.fullName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />

                <div className="info">
                  <h3>{user.fullName}</h3>
                </div>

                <div className="points">{user.totalPoints} POINTS</div>

                <Link to={`/view-profile/${user.userId}`} className="profile-button">
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



