import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('http://127.0.0.1:8000/api/google-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: idToken }),
      });

      const data = await response.json();
      console.log('Response from backend:', data)

      if (response.ok) {
        alert(`Welcome ${data.user.name}`);
        navigate('/dashboard', { state: { user: data.user } });
      } else {
        alert(`Login failed: ${data.error}`);
      }

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Something went wrong during Google Sign-In');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login with Google</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
