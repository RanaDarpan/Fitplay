// // src/Components/Header.jsx

// import React from 'react';
// import { FaBars, FaUserCircle, FaCog, FaQuestionCircle, FaInfoCircle, FaTrophy } from 'react-icons/fa';
// import { MdSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
// import { Link } from 'react-router-dom';

// const Header = ({ isMenuOpen, toggleMenu }) => {
//   return (
//     <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
//       <h1 className="text-2xl font-bold">FitPlay</h1>
//       <button className="md:hidden block text-2xl" onClick={toggleMenu}>
//         <FaBars />
//       </button>
//       {/* Desktop Menu */}
//       <ul className="hidden md:flex space-x-6">
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <FaUserCircle />
//           <Link to="/profile">Profile</Link>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <FaTrophy />
//           <span>My Points</span>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <MdSportsCricket />
//           <span>Sports</span>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <MdOutlineLeaderboard />
//           <span>Leaderboard</span>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <FaQuestionCircle />
//           <Link to="/chatbot">Help</Link>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <FaInfoCircle />
//           <span>About</span>
//         </li>
//         <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
//           <FaCog />
//           <span>Settings</span>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Header;
// src/Components/Header/Header.jsx

import React from 'react';
import { FaBars, FaUserCircle, FaCog, FaQuestionCircle, FaInfoCircle, FaTrophy } from 'react-icons/fa';
import { MdSportsCricket, MdOutlineLeaderboard } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation(); // To determine the active route

  const navLinks = [
    { name: 'Profile', path: '/profile', icon: <FaUserCircle /> },
    { name: 'My Points', path: '/points', icon: <FaTrophy /> },
    { name: 'Sports', path: '/sports', icon: <MdSportsCricket /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <MdOutlineLeaderboard /> },
    { name: 'Help', path: '/chatbot', icon: <FaQuestionCircle /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center relative">
      {/* Logo or Brand Name */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">FitPlay</h1>
      </div>

      {/* Hamburger Menu Button for Mobile */}
      <button className="md:hidden block text-2xl" onClick={toggleMenu}>
        <FaBars />
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <li
            key={link.name}
            className={`flex items-center space-x-1 cursor-pointer hover:text-gray-300 ${
              location.pathname === link.path ? 'text-blue-400' : ''
            }`}
          >
            <Link to={link.path}>{link.icon}</Link>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="absolute top-full left-0 w-full bg-gray-800 text-white p-4 space-y-4 md:hidden z-10">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className={`flex items-center space-x-2 cursor-pointer hover:text-gray-300 ${
                location.pathname === link.path ? 'text-blue-400' : ''
              }`}
            >
              <Link to={link.path}>{link.icon}</Link>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Header;
