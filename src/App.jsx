import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './Components/AuthForm';
import Dashboard from './Components/Dashboard';
import ErrorBoundary from './Components/ErrorBoundary';
import Profile from './Components/Profile';
import Chatbot from './Components/Chatbot';
import Points from './Components/Points';
import Leaderboard from './Components/Leaderboard';
const App = () => {
  return (
    <Router>
    {/* <ErrorBoundary> */}
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/points" element={<Points />} />
      </Routes>
      {/* </ErrorBoundary> */}
    </Router>
  );
};

export default App;
