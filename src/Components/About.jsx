// src/Components/About.jsx

import React from 'react';
import { FaReact, FaGithub, FaLinkedin } from 'react-icons/fa';
import Header from './Header/Header'; // Reuse the Header component
import { useState } from 'react';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-8 animate-bounceIn">
          About FitPlay
        </h2>
        <p className="text-center text-lg text-gray-700 mb-8 animate-fadeInUp">
          FitPlay is designed to help users achieve their fitness goals with personalized workout plans and progress tracking. This application was built using modern web technologies to ensure a seamless user experience.
        </p>

        {/* Developer Info */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 animate-slideInLeft">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">About the Developer</h3>
          <p className="text-lg text-gray-700 mb-4">
            Developed by <span className="text-blue-600">Rana Darpan</span>, a passionate web developer specializing in creating interactive and user-friendly web applications.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/ranadarpan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transform transition duration-300"
            >
              <FaGithub className="text-2xl text-gray-800 hover:text-gray-600 transition duration-200" />
            </a>
            <a
              href="https://www.linkedin.com/in/ranadarpan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transform transition duration-300"
            >
              <FaLinkedin className="text-2xl text-blue-700 hover:text-blue-500 transition duration-200" />
            </a>
            <FaReact className="text-2xl text-blue-500 animate-spin-slow" />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white shadow-lg rounded-lg p-8 animate-slideInRight">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Technologies Used</h3>
          <p className="text-lg text-gray-700">
            FitPlay is built using:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 mt-4">
            <li className="hover:translate-x-2 transform transition duration-300">React.js</li>
            <li className="hover:translate-x-2 transform transition duration-300">Firebase for authentication and database</li>
            <li className="hover:translate-x-2 transform transition duration-300">Tailwind CSS for responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
