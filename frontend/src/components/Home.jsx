import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();

  // Grab username passed from navigate() call
  const username = location.state?.username || 'User'; // fallback if missing

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, {username}!</h1>
    </div>
  );
};

export default Home;
