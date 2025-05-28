import React, { useEffect, useState } from 'react';
import '../Style/EditProfile.css';

const EditProfile: React.FC = () => {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    location: '',
    interests: '',
    favoriteSports: '',
    availability: '',
    bio: '',
    phoneNumber: '',
    socialMediaLink: '',
    gender: '',
    age: '',
    selectedAchievement: '',
  });

  const achievements = [
    'Most Valuable Player',
    'Best Team Player',
    'Top Scorer',
    'Longest Distance',
    'Fastest Time'
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const [userRes, profileRes] = await Promise.all([
          fetch(`http://localhost/api/Users/${userId}`),
          fetch(`http://localhost/api/Profiles/${userId}`)
        ]);

        if (!userRes.ok || !profileRes.ok) throw new Error('Failed to load profile');

        const userData = await userRes.json();
        const profileData = await profileRes.json();

        setFormData(prev => ({
          ...prev,
          name: userData.name,
          email: userData.email,
          profilePicture: profileData.profilePicture || '',
          location: profileData.location || '',
          interests: profileData.interests || '',
          favoriteSports: profileData.favoriteSports || '',
          availability: profileData.availability || '',
          bio: profileData.bio || '',
          phoneNumber: profileData.phoneNumber || '',
          socialMediaLink: profileData.socialMediaLink || '',
          gender: profileData.gender || '',
          age: profileData.age?.toString() || ''
        }));
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await fetch('http://localhost/api/upload', {
        method: 'POST',
        body: data,
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const result = await res.json();
      console.log('Image uploaded, URL:', result.imageUrl);
      setFormData(prev => ({ ...prev, profilePicture: result.imageUrl }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Update user info
      await fetch(`http://localhost/api/Users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          name: formData.name,
          email: formData.email
        })
      });

      // Update profile
      await fetch(`http://localhost/api/Profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          profilePicture: formData.profilePicture,
          location: formData.location,
          interests: formData.interests,
          favoriteSports: formData.favoriteSports,
          availability: formData.availability,
          bio: formData.bio,
          phoneNumber: formData.phoneNumber,
          socialMediaLink: formData.socialMediaLink,
          gender: formData.gender,
          age: parseInt(formData.age),
        })
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Edit Profile</h2>

        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Profile Picture URL</label>
        <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />

        <label>Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />

        <label>Interests</label>
        <input type="text" name="interests" value={formData.interests} onChange={handleChange} />

        <label>Favourite Sports</label>
        <input type="text" name="favoriteSports" value={formData.favoriteSports} onChange={handleChange} />

        <label>Availability</label>
        <input type="text" name="availability" value={formData.availability} onChange={handleChange} />

        <label>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

        <label>Social Media Link</label>
        <input type="text" name="socialMediaLink" value={formData.socialMediaLink} onChange={handleChange} />

        <label>Gender</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} />

        <label>Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />

        {/* ✅ Move upload outside of <select> to prevent nesting error */}
        <label>Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          name="profilePictureUpload"
          onChange={handleImageUpload}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
