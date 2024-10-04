// // src/Components/Dashboard.jsx

// import React, { useState, useEffect } from 'react';
// import {
//   FaBars,
//   FaUserCircle,
//   FaCog,
//   FaQuestionCircle,
//   FaInfoCircle,
//   FaTrophy,
// } from 'react-icons/fa';
// import { MdSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
// import { Link } from 'react-router-dom';
// import { auth } from '../firebase/Firebase';
// import Progress from './Progress';
// import Notification from './Notification';
// import SocialInteraction from './SocialInteraction';
// import ActivityChart from './ActivityChart';

// const Dashboard = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [activityData, setActivityData] = useState([]); // Initialize as empty

//   useEffect(() => {
//     const user = auth.currentUser;
//     setUserName(user ? user.displayName || user.email.split('@')[0] : 'Guest');
//   }, []);

//   // Function to update activity points from Progress component
//   const updateActivityPoints = (dailyPointsArray) => {
//     // Update activity data dynamically from Progress
//     if (dailyPointsArray && dailyPointsArray.length > 0) {
//       setActivityData(dailyPointsArray);
//     } else {
//       setActivityData([{ day: 'No Data', points: 0 }]);
//     }
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">FitPlay</h1>
//         <button className="md:hidden block text-2xl" onClick={toggleMenu}>
//           <FaBars />
//         </button>
//         {/* Desktop Menu */}
//         <ul className="hidden md:flex space-x-6">
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaUserCircle />
//             <Link to="/profile">Profile</Link>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaTrophy />
//             <span>My Points</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <MdSportsCricket />
//             <span>Sports</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <MdOutlineLeaderboard />
//             <span>Leaderboard</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaQuestionCircle />
//             <Link to="/chatbot">Help</Link>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaInfoCircle />
//             <span>About</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaCog />
//             <span>Settings</span>
//           </li>
//         </ul>
//       </nav>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <ul className="md:hidden bg-gray-800 text-white p-4 space-y-4">
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaUserCircle />
//             <Link to="/profile">Profile</Link>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaTrophy />
//             <span>My Points</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <MdSportsCricket />
//             <span>Sports</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <MdOutlineLeaderboard />
//             <span>Leaderboard</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaQuestionCircle />
//             <Link to="/chatbot">Help</Link>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaInfoCircle />
//             <span>About</span>
//           </li>
//           <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//             <FaCog />
//             <span>Settings</span>
//           </li>
//         </ul>
//       )}

//       {/* Main Content */}
//       <div className="p-6">
//         <h2 className="text-3xl font-bold mb-6 text-center">
//           Welcome, {userName}!
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Progress Section */}
//           <div className="lg:col-span-2">
//             <Progress updateActivityPoints={updateActivityPoints} />
//           </div>

//           {/* Notification Section */}
//           <div className="lg:col-span-1">
//             <Notification />
//           </div>
//         </div>

//         {/* Activity Chart Section */}
//         <div className="mt-6">
//           <ActivityChart activityData={activityData} />
//         </div>

//         {/* Social Interaction Section */}
//         <div className="mt-6">
//           <SocialInteraction />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// src/Components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/Firebase';
import Progress from './Progress';
import Notification from './Notification';
import SocialInteraction from './SocialInteraction';
import ActivityChart from './ActivityChart';
import Header from './Header/Header'; // Import the new Header component
import { FaUserCircle, FaTrophy, FaQuestionCircle, FaInfoCircle, FaCog } from 'react-icons/fa';
import { MdSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [activityData, setActivityData] = useState([]); // Initialize as empty

  useEffect(() => {
    const user = auth.currentUser;
    setUserName(user ? user.displayName || user.email.split('@')[0] : 'Guest');
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
          <SocialInteraction />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
