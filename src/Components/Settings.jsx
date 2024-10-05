// src/components/Settings.jsx

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaCog, FaUserCircle, FaEnvelope, FaSms, FaMobileAlt, FaGlobe, FaLock } from 'react-icons/fa';
import { MdPrivacyTip } from 'react-icons/md';
import Header from './Header/Header'; // Import the updated Header component
import { useNavigate } from 'react-router-dom';

const Settings = ({ handleThemeToggle, theme }) => {
  const navigate = useNavigate();

  // State Management
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [language, setLanguage] = useState('en');
  const [privacy, setPrivacy] = useState(true);
  const [displayName, setDisplayName] = useState('John Doe');
  const [profilePic, setProfilePic] = useState(null); // Handle profile picture upload

  // Retrieve persisted settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light theme
    const savedNotifications = JSON.parse(localStorage.getItem('notifications'));
    const savedLanguage = localStorage.getItem('language');
    const savedPrivacy = JSON.parse(localStorage.getItem('privacy'));
    const savedDisplayName = localStorage.getItem('displayName');
    const savedProfilePic = localStorage.getItem('profilePic');

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedNotifications) setNotifications(savedNotifications);
    if (savedLanguage) setLanguage(savedLanguage);
    if (typeof savedPrivacy === 'boolean') setPrivacy(savedPrivacy);
    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedProfilePic) setProfilePic(savedProfilePic);
  }, []);

  // Handle Notification Toggle
  const handleNotificationToggle = (type) => {
    setNotifications((prev) => {
      const updated = { ...prev, [type]: !prev[type] };
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Language Change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    // Implement language change logic if needed
  };

  // Handle Privacy Toggle
  const handlePrivacyToggle = () => {
    setPrivacy((prev) => {
      localStorage.setItem('privacy', !prev);
      return !prev;
    });
  };

  // Handle Display Name Change
  const handleDisplayNameChange = (e) => {
    const newName = e.target.value;
    setDisplayName(newName);
    localStorage.setItem('displayName', newName);
    // Implement backend update if needed
  };

  // Handle Profile Picture Upload
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setProfilePic(upload.target.result);
        localStorage.setItem('profilePic', upload.target.result);
        // Implement upload to backend/storage if needed
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle Back to Dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Handle Theme Change
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    handleThemeToggle(); // Call the prop function to update theme in the parent component
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500`}>
      {/* Header */}
      <Header theme={theme} handleThemeToggle={handleThemeToggle} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Settings
        </h2>

        {/* Settings Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="mb-4 md:mb-0">
              <img
                src={profilePic || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                id="profile-pic-upload"
              />
              <label
                htmlFor="profile-pic-upload"
                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Upload Picture
              </label>
            </div>
            <div className="md:ml-6 w-full">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-700 dark:text-gray-300 flex items-center">
              {theme === 'light' ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
              Theme
            </span>
            <button
              onClick={toggleTheme} // Call the new toggleTheme function
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                theme === 'light'
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
              aria-label="Toggle Theme"
            >
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>

          {/* Notification Preferences */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
              <FaEnvelope className="mr-2" /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    notifications.email ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Email Notifications"
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      notifications.email ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaSms className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('sms')}
                  className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    notifications.sms ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle SMS Notifications"
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      notifications.sms ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaMobileAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                </div>
                <button
                  onClick={() => handleNotificationToggle('push')}
                  className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    notifications.push ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Push Notifications"
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      notifications.push ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
              <FaGlobe className="mr-2" /> Language Preference
            </h3>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              {/* Add more languages as needed */}
            </select>
          </div>

          {/* Privacy Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MdPrivacyTip className="mr-2 text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300">Privacy Settings</span>
            </div>
            <button
              onClick={handlePrivacyToggle}
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                privacy ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-black'
              }`}
              aria-label="Toggle Privacy Settings"
            >
              {privacy ? 'Private' : 'Public'}
            </button>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={handleBackToDashboard}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
