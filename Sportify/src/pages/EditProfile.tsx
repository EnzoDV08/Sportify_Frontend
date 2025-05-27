import React, { useState } from 'react';
import '../Style/EditProfile.css';

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    profilePicture: '',
    selectedAchievement: ''
  });

  const achievements = [
    'Most Valuable Player',
    'Best Team Player',
    'Top Scorer',
    'Longest Distance',
    'Fastest Time'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated profile data:', formData);
    // You would normally send a PUT request here
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Edit Profile</h2>

        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="description">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />

        <label htmlFor="profilePicture">Profile Picture URL</label>
        <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />

        <label htmlFor="selectedAchievement">Select Achievement</label>
        <select name="selectedAchievement" value={formData.selectedAchievement} onChange={handleChange}>
          <option value="">-- Choose One --</option>
          {achievements.map((achievement, index) => (
            <option key={index} value={achievement}>
              {achievement}
            </option>
          ))}
        </select>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
