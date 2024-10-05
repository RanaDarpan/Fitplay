
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import run from '../api/GeminiAPI';
import Header from './Header/Header'; // Import the Header component

const sportsOptions = [
  { name: 'Soccer' },
  { name: 'Basketball' },
  { name: 'Tennis' },
  { name: 'Swimming' },
  { name: 'Cycling' },
];

const levels = [
  { name: 'Beginner', description: 'Basic skills and techniques.', minPoints: 0, maxPoints: 50 },
  { name: 'Intermediate', description: 'Building on skills with practice.', minPoints: 51, maxPoints: 150 },
  { name: 'Advanced', description: 'Competitive strategies and advanced techniques.', minPoints: 151, maxPoints: Infinity },
];

const Sports = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [userLevel, setUserLevel] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [roadmap, setRoadmap] = useState([]);
  const [error, setError] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  };

  const fetchUserPoints = async (uid) => {
    try {
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const completedTasksData = data.completedTasks || {};
        const totalPoints = calculateActivity(completedTasksData).pointsEarned || 0;
        setTotalPoints(totalPoints);
        setUserLevel(determineLevel(totalPoints));
      } else {
        setError('User data not found.');
      }
    } catch (err) {
      console.error('Error fetching user points:', err);
      setError('Failed to fetch user points. Please try again.');
    }
  };

  const determineLevel = (points) => {
    const level = levels.find(l => points >= l.minPoints && points <= l.maxPoints);
    return level ? level.name : null;
  };

  const calculateActivity = (completedTasks) => {
    let totalPoints = 0;

    Object.values(completedTasks).forEach((week) => {
      Object.values(week).forEach((day) => {
        Object.values(day).forEach((exerciseCompleted) => {
          if (exerciseCompleted) {
            totalPoints += 5;
          }
        });
      });
    });

    return { pointsEarned: totalPoints };
  };

  const cleanResponse = (text) => {
    const regex = /```json[\s\S]*?```/;
    return text.replace(regex, '').trim();
  };

  const fetchRoadmap = async (sport, level) => {
    setError('');
    setLoading(true);
    try {
      const prompt = `Generate a detailed training roadmap for a ${level} level athlete in ${sport}. The response should be in pure JSON format with an array of tasks, each containing "task", "description", and "goal". Do not include any explanations or markdown.`;
      const generatedRoadmap = await run(prompt);
      
      const cleanedRoadmap = cleanResponse(generatedRoadmap);
      
      let parsedRoadmap;
      try {
        parsedRoadmap = JSON.parse(cleanedRoadmap);
      } catch (jsonError) {
        console.error('Error parsing roadmap JSON:', jsonError);
        setError('Failed to parse the roadmap data. Ensure the format is correct.');
        return;
      }

      if (Array.isArray(parsedRoadmap)) {
        setRoadmap(parsedRoadmap);
      } else if (parsedRoadmap.tasks && Array.isArray(parsedRoadmap.tasks)) {
        setRoadmap(parsedRoadmap.tasks);
      } else {
        console.error('Invalid roadmap format:', parsedRoadmap);
        setError('Received invalid roadmap data.');
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError('Failed to fetch the roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserPoints(user.uid);
      } else {
        setTotalPoints(0);
        setUserLevel(null);
        setRoadmap([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedSport && userLevel) {
      fetchRoadmap(selectedSport, userLevel);
    }
  }, [selectedSport, userLevel]);

  const toggleTask = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-white shadow-md rounded-lg transition-transform duration-300 flex-grow">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600">Select Your Favorite Sport</h2>
        <select
          className="border border-gray-300 p-2 rounded-md w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          value={selectedSport}
          onChange={handleSportChange}
        >
          <option value="" disabled>Select a sport</option>
          {sportsOptions.map((sport, index) => (
            <option key={index} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </select>

        {selectedSport && (
          <>
            <div className="mb-4 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">Your Current Level: <span className="text-blue-600">{userLevel || 'N/A'}</span></h3>
              <h4 className="text-xl sm:text-2xl font-semibold text-gray-700">Total Points: <span className="text-blue-600">{totalPoints}</span></h4>
            </div>

            {loading && <p className="text-center text-blue-500">Loading roadmap...</p>}

            {roadmap.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg mt-4 space-y-4 shadow-inner">
                <h4 className="text-lg sm:text-xl font-semibold text-center text-gray-800">Roadmap for <span className="text-blue-600">{selectedSport}</span> - {userLevel}</h4>
                <div className="space-y-4">
                  {roadmap.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 bg-white transform hover:scale-105">
                      <div
                        className="flex justify-between items-center cursor-pointer hover:bg-blue-100 transition duration-200 rounded-lg p-2"
                        onClick={() => toggleTask(index)}
                      >
                        <h5 className="font-semibold text-gray-800">{item.task}</h5>
                        <span className="font-medium text-gray-500">{openIndex === index ? '-' : '+'}</span>
                      </div>
                      {openIndex === index && (
                        <div className="mt-2 border-t pt-2">
                          <p className="text-sm sm:text-base text-gray-700">{item.description}</p>
                          <p className="mt-2 font-medium text-gray-800">Goal: <span className="font-bold text-blue-600">{item.goal}</span></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loading && <p className="mt-2 text-center text-gray-500">No roadmap available for the selected sport and level.</p>
            )}

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Sports;




