import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './Components/AuthForm';
import Dashboard from './Components/Dashboard';
import ErrorBoundary from './Components/ErrorBoundary';
import Profile from './Components/Profile';
import Chatbot from './Components/Chatbot';
import Points from './Components/Points';
import Settings from './Components/Settings';
import Sports from './Components/Sports';
import About from './Components/About';
import Leaderboard from './Components/Leaderboard';
import { useState,useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('light'); // Default theme

  // Retrieve theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    const html = document.documentElement;
    if (savedTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);

  // Handle theme toggle
  const handleThemeToggle = (newTheme) => {
    setTheme(newTheme);
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    // Persist the theme preference
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Router>
    {/* <ErrorBoundary> */}
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/points" element={<Points />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sports" element={<Sports />} />
      </Routes>
      {/* </ErrorBoundary> */}
    </Router>
  );
};

export default App;
