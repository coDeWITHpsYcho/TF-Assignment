import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    return <h1>No user data found.</h1>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {user.name}!</h1>
      <img
        src={user.profile_picture}
        alt="Profile"
        style={{ borderRadius: '50%', width: '150px', height: '150px' }}
      />
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age || 'Not set'}</p>
      <p><strong>Contact:</strong> {user.contact_number || 'Not set'}</p>
      <p><strong>Employer:</strong> {user.employer_details || 'Not set'}</p>
    </div>
  );
};

export default Dashboard;
