import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const initialUser = location.state?.user;

  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    age: user.age || '',
    contact_number: user.contact_number || '',
    employer_details: user.employer_details || '',
  });

  if (!user) {
    return <h1>No user data found.</h1>;
  }

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/update-profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.username, // Firebase UID as username
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);

      // Update user state with the new profile info
      setUser(data.user);
      setEditMode(false);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile!');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {user.name}!</h1>
      <img
        src={user.profile_picture}
        alt="Profile"
        style={{ borderRadius: '50%', width: '150px', height: '150px' }}
      />

      <p><strong>Email:</strong> {user.email}</p>

      {editMode ? (
        <>
          <div>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Contact Number:
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Employer Details:
              <input
                type="text"
                name="employer_details"
                value={formData.employer_details}
                onChange={handleChange}
              />
            </label>
          </div>

          <button onClick={handleSave} style={buttonStyle}>Save</button>
          <button onClick={handleEditToggle} style={{ ...buttonStyle, backgroundColor: '#ccc' }}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Age:</strong> {user.age || 'Not set'}</p>
          <p><strong>Contact:</strong> {user.contact_number || 'Not set'}</p>
          <p><strong>Employer:</strong> {user.employer_details || 'Not set'}</p>

          <button onClick={handleEditToggle} style={buttonStyle}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Dashboard;
