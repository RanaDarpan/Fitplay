import React, { useState } from 'react';

const Settings = ({ onThemeToggle, currentTheme, onBackToDashboard }) => {
  const [theme, setTheme] = useState(currentTheme || 'light'); // Default to 'light' theme

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    onThemeToggle(newTheme); 
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700">Theme</span>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            theme === 'light' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={handleThemeToggle}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {/* Other settings options can go here */}
      <div>
        <h3 className="font-semibold mb-2">Other Settings</h3>
        <ul className="list-disc ml-4 text-gray-600">
          <li>Notification preferences</li>
          <li>Language options</li>
          <li>Account management</li>
        </ul>
      </div>

       
     
    </div>
  );
};

export default Settings;
