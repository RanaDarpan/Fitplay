// src/Components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Progress from './Progress';
import Notification from './Notification';
import SocialInteraction from './SocialInteraction';
import ActivityChart from './ActivityChart';
import Header from './Header/Header'; // Import the Header component
import { FaUserCircle, FaTrophy, FaQuestionCircle, FaInfoCircle, FaCog } from 'react-icons/fa';
import { MdSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [activityData, setActivityData] = useState([]); // Initialize as empty
  const [currentUserLocation, setCurrentUserLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.displayName || user.email.split('@')[0]);

        // Fetch user's location from Firestore
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const location = userData.location || '';
            setCurrentUserLocation(location);
          } else {
            console.warn('No user document found!');
            setCurrentUserLocation('');
            setLocationError(true);
          }
        } catch (error) {
          console.error('Error fetching user location:', error);
          setLocationError(true);
        }
      } else {
        setUserName('Guest');
        setCurrentUserLocation('');
      }
      setLoadingLocation(false);
    };

    fetchUserInfo();
  }, []);

  // Function to update activity points from Progress component
  const updateActivityPoints = (dailyPointsArray) => {
    // Update activity data dynamically from Progress
    if (dailyPointsArray && dailyPointsArray.length > 0) {
      setActivityData(dailyPointsArray);
    } else {
      setActivityData([{ day: 'No Data', points: 0 }]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loadingLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (locationError && currentUserLocation === '') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error fetching user location.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="md:hidden bg-gray-800 text-white p-4 space-y-4">
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaUserCircle />
            <Link to="/profile">Profile</Link>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaTrophy />
            <span>My Points</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <MdSportsCricket />
            <span>Sports</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <MdOutlineLeaderboard />
            <span>Leaderboard</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaQuestionCircle />
            <Link to="/chatbot">Help</Link>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaInfoCircle />
            <span>About</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
            <FaCog />
            <span>Settings</span>
          </li>
        </ul>
      )}

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome, {userName}!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="lg:col-span-2">
            <Progress updateActivityPoints={updateActivityPoints} />
          </div>

          {/* Notification Section */}
          <div className="lg:col-span-1">
            <Notification />
          </div>
        </div>

        {/* Activity Chart Section */}
        <div className="mt-6">
          <ActivityChart activityData={activityData} />
        </div>

        {/* Social Interaction Section */}
        <div className="mt-6">
          <SocialInteraction currentUserLocation={currentUserLocation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
