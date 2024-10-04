// src/Components/Profile.jsx

import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaSave, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { auth, firestore } from '../firebase/Firebase'; // Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  // State variables
  const [editMode, setEditMode] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    email: '',
    age: '',
    location: '',
    height: '',
    weight: '',
  });
  const [completedTasks, setCompletedTasks] = useState({});
  const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation after logout

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Set profile information
        setProfileInfo({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          location: data.location || '',
          height: data.height || '',
          weight: data.weight || '',
        });
        // Set completed tasks
        setCompletedTasks(data.completedTasks || {});
        // Calculate activity points
        calculateActivity(data.completedTasks || {});
      } else {
        console.log('No such document!');
        setError('No profile data found.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data');
      setLoading(false);
    }
  };

  const calculateActivity = (completedTasks) => {
    let totalWorkouts = 0;
    let totalPoints = 0;
  
    Object.values(completedTasks).forEach((week) => {
      Object.values(week).forEach((day) => {
        // Count points based on completed exercises
        Object.values(day).forEach((exerciseCompleted) => {
          if (exerciseCompleted) {
            totalPoints += 5; // 5 points per completed exercise
          }
        });
        
        // Increment total workouts if the day is completed
        if (day.completed) {
          totalWorkouts += 1; // Each completed day counts as one workout
        }
      });
    });
  
    // Calculate total workouts based on total points
    totalWorkouts = totalPoints / 5; // Each 5 points equals one workout
  
    // Set the state for workouts completed and points earned
    setWorkoutsCompleted(totalWorkouts);
    setPointsEarned(totalPoints);
  };
  


  // Fetch user data on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setProfileInfo((prev) => ({ ...prev, email: user.email }));
      fetchUserData(user.uid);
    } else {
      setError('User not logged in');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Save profile changes to Firestore
  const saveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, profileInfo);
        setEditMode(false);
        alert('Profile updated successfully');
        // Optionally, refetch user data to ensure consistency
        fetchUserData(user.uid);
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Error updating profile');
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to AuthForm.jsx
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error during logout. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center relative">
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0 z-0">
        {/* Add your 3D components here */}
      </Canvas>

      {/* Header with Logout Button */}
      <div className="w-full max-w-4xl flex justify-end z-10">
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      {/* Profile Title */}
      <h1 className="text-3xl font-bold mb-6 z-10">Your Profile</h1>

      {/* Profile Information */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-sm p-6 relative z-10">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
          />
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={profileInfo.name}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={profileInfo.email}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Email"
                readOnly
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{profileInfo.name || 'Your Name'}</h2>
              <p className="text-gray-600">{profileInfo.email}</p>
            </>
          )}
          <p className="text-gray-600 mb-4">Joined: January 2024</p>

          {editMode ? (
            <button
              onClick={saveProfile}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              Save Profile
            </button>
          ) : (
            <button
              onClick={toggleEditMode}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <FaUserEdit className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="w-full max-w-sm mt-6 z-10">
        {/* Fitness Progress */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Fitness Progress</h3>
          <ul className="list-disc ml-4 text-gray-600">
            <li>Workouts Completed: {workoutsCompleted}</li>
            <li>Points Earned: {pointsEarned}</li>
            <li>Level: {profileInfo.level || 'Beginner'}</li>
          </ul>
        </div>

        {/* Personal Details */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
          {editMode ? (
            <>
              <label className="block text-left">Age</label>
              <input
                type="text"
                name="age"
                value={profileInfo.age}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Age"
              />
              <label className="block text-left">Location</label>
              <input
                type="text"
                name="location"
                value={profileInfo.location}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Location"
              />
              <label className="block text-left">Height</label>
              <input
                type="text"
                name="height"
                value={profileInfo.height}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Height"
              />
              <label className="block text-left">Weight</label>
              <input
                type="text"
                name="weight"
                value={profileInfo.weight}
                onChange={handleInputChange}
                className="border p-2 rounded mb-2 w-full"
                placeholder="Weight"
              />
            </>
          ) : (
            <ul className="list-disc ml-4 text-gray-600">
              <li>Age: {profileInfo.age || 'N/A'}</li>
              <li>Location: {profileInfo.location || 'N/A'}</li>
              <li>Height: {profileInfo.height || 'N/A'}</li>
              <li>Weight: {profileInfo.weight || 'N/A'}</li>
            </ul>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-4 z-10">
        <Link
          to="/dashboard"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Profile;
