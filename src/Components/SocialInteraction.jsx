import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase/Firebase'; // Ensure auth is imported
import { collection, getDocs } from 'firebase/firestore';
import { computeTotalPoints } from './utils/computeTotalPoints'; // Import the helper function for points calculation

const SocialInteraction = ({ currentUserLocation }) => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      setLoading(true);
      setError(false);
      try {
        const usersCollection = collection(firestore, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const allUsers = userSnapshot.docs.map((doc) => {
          const data = doc.data();
          const name = data.name || 'Anonymous';
          const completedTasks = data.completedTasks || {};
          const totalPoints = computeTotalPoints(completedTasks); // Calculate total points

          return {
            id: doc.id,
            name,
            location: data.location ? data.location.trim().toLowerCase() : '', // Normalize location
            progressPoints: totalPoints,
            avatar: data.avatar || 'https://via.placeholder.com/150', // Add avatar with fallback
          };
        });

        console.log('All Users:', allUsers); // Debug: log all users fetched

        // Normalize currentUserLocation
        const normalizedCurrentUserLocation = currentUserLocation
          ? currentUserLocation.trim().toLowerCase()
          : '';

        console.log(`Current User Location: "${normalizedCurrentUserLocation}"`);

        // Get current user's UID
        const currentUser = auth.currentUser;
        const currentUserUid = currentUser ? currentUser.uid : null;

        if (!currentUserUid) {
          console.warn('No authenticated user found.');
          setError(true);
          setLoading(false);
          return;
        }

        // Filter users based on the current user's location and exclude current user
        const filteredUsers = allUsers.filter((user) => {
          const isSameLocation = user.location === normalizedCurrentUserLocation;
          const isNotCurrentUser = user.id !== currentUserUid;
          console.log(
            `User ID: "${user.id}" | Location Match: ${isSameLocation} | Not Current User: ${isNotCurrentUser}`
          );
          return isSameLocation && isNotCurrentUser;
        });

        console.log('Filtered Nearby Users:', filteredUsers);

        setNearbyUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserLocation) {
      fetchNearbyUsers();
    } else {
      console.warn('Current user location is not provided.');
      setError(true);
      setLoading(false);
    }
  }, [currentUserLocation]);

  // Placeholder function for handling connect button click
  const handleConnect = (userId, userName) => {
    // Implement your connect logic here (e.g., send a connection request, open chat, etc.)
    console.log(`Connect button clicked for ${userName} (ID: ${userId})`);
    alert(`Connect with ${userName}!`);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded mt-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Nearby Users</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <p className="text-red-500">Error fetching nearby users. Please try again later.</p>
      ) : nearbyUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nearbyUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow hover:bg-indigo-50 transition duration-200"
            >
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-24 h-24 rounded-full mb-4 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150'; // Placeholder image
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Points: {user.progressPoints}</p>
              <button
                onClick={() => handleConnect(user.id, user.name)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No nearby users found.</p>
      )}
    </div>
  );
};

export default SocialInteraction;
