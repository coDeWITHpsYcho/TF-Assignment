import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [age, setAge] = useState(user.age || '');
  const [contactNumber, setContactNumber] = useState(user.contact_number || '');
  const [employerDetails, setEmployerDetails] = useState(user.employer_details || '');

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token'); // if using JWT tokens
    const formData = new FormData();

    if (profilePhoto) {
      formData.append('profile_picture', profilePhoto);
    }
    formData.append('age', age);
    formData.append('contact_number', contactNumber);
    formData.append('employer_details', employerDetails);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-profile/', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Profile Photo:</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {profilePhoto && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Preview"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            </div>
          )}
        </div>
        <div>
          <label>Age:</label><br />
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label>Contact Number:</label><br />
          <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </div>
        <div>
          <label>Employer Details:</label><br />
          <input type="text" value={employerDetails} onChange={(e) => setEmployerDetails(e.target.value)} />
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
