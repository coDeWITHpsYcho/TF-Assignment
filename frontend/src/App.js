import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLoginButton from './components/GoogleLoginButton';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLoginButton />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
