import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { FaArrowLeft } from 'react-icons/fa';
import { auth, firestore } from '../firebase/Firebase'; // Ensure correct path
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Points = () => {// State variables
  const [profileInfo, setProfileInfo] = useState({
    pointsEarned:0,
    workoutsCompleted: 0,
    completedTasks: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // For navigation after logout
  
  // Colors for Pie Chart
  const COLORS = ['#0088FE', '#FF8042'];

  const calculateActivity = (completedTasks) => {
    let totalWorkouts = 0;
    let totalPoints = 0;
  
    Object.values(completedTasks).forEach((week) => {
      Object.values(week).forEach((day) => {
        // Count points based on completed exercises
        Object.values(day).forEach((exerciseCompleted) => {
          if (exerciseCompleted) {
            totalWorkouts += 1;
            totalPoints += 5; // 5 points per completed exercise
          }
        });
        
        
      });
    });
  
    
    return { workoutsCompleted: totalWorkouts, pointsEarned: totalPoints };
  };
  


  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const completedTasksData = data.completedTasks || {};
  
        // Calculate workoutsCompleted and pointsEarned
        const { workoutsCompleted, pointsEarned } = calculateActivity(completedTasksData);
  
        // Update state with fetched and calculated data
        setProfileInfo({
          pointsEarned,
          workoutsCompleted,
          completedTasks: completedTasksData,
        });
      } else {
        console.error('No such document!');
        setError('No profile data found.');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error fetching user data.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user data when component mounts and auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setError('User not logged in.');
        setLoading(false);
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  

  const prepareChartData = () => {
    if (!profileInfo || !profileInfo.completedTasks) return {};
  
    const { completedTasks } = profileInfo;
  
    // Activity Chart: Points over time (per day)
    // const activityData = [];
    // Object.keys(completedTasks).forEach((weekKey) => {
    //   const week = completedTasks[weekKey];
    //   if (typeof week !== 'object' || week === null) return;
  
    //   Object.keys(week).forEach((dayKey) => {
    //     const day = week[dayKey];
    //     if (typeof day !== 'object' || day === null) return;
  
    //     // Extract numerical part from weekKey and dayKey
    //     const weekNumberMatch = weekKey.match(/\d+/);
    //     const dayNumberMatch = dayKey.match(/\d+/);
    //     const weekNumber = weekNumberMatch ? parseInt(weekNumberMatch[0], 10) : 0;
    //     const dayNumber = dayNumberMatch ? parseInt(dayNumberMatch[0], 10) : 0;
  
    //     const dateLabel = `W${weekNumber}D${dayNumber}`;
  
    //     // Points calculation: 5 points per completed exercise
    //     const points = Object.values(day.exercises || {}).filter((ex) => ex).length* 5; // 5 points per completed exercise

    //     activityData.push({ date: dateLabel, points });
    //   });
    // });


    const activityData = [];

    // Iterate over each week in completedTasks
    Object.entries(completedTasks).forEach(([weekKey, weekData]) => {
      const weekIndex = parseInt(weekKey, 10);
      
      // Validate weekIndex and weekData
      if (isNaN(weekIndex) || typeof weekData !== 'object' || weekData === null) return;
    
      // Iterate over each day in the current week
      Object.entries(weekData).forEach(([dayKey, dayData]) => {
        const dayIndex = parseInt(dayKey, 10);
        
        // Validate dayIndex and dayData
        if (isNaN(dayIndex) || typeof dayData !== 'object' || dayData === null) return;
    
        // Generate a readable date label (e.g., "Week 1 Day 2")
        // const dateLabel = `Week ${weekIndex + 1} Day ${dayIndex + 1}`;
        const dateLabel = `W${weekIndex+1}D${dayIndex+1}`;
        // Calculate points: 5 points per completed exercise
        // Assuming dayData is an object where each key represents an exercise index
        const completedExercises = Object.values(dayData).filter(Boolean).length;
        const points = completedExercises * 5;
    
        // Push the calculated data into activityData array
        activityData.push({ date: dateLabel, points });
      });
    });
    
    console.log(activityData);
    

    // Task Performance: Completed vs Pending
let completed = 0;
let pending = 0;

Object.values(completedTasks).forEach((week) => {
  if (typeof week !== 'object' || week === null) return;

  Object.values(week).forEach((day) => {
    if (typeof day !== 'object' || day === null) return;

    const totalExercises = Object.keys(day).length;
    const completedExercises = Object.values(day).filter((exercise) => exercise === true).length;

    // If all exercises for the day are completed, mark the day as completed
    if (completedExercises === totalExercises && totalExercises > 0) {
      completed += 1;
    } else {
      pending += 1;
    }
  });
});

const taskPerformanceData = [
  { name: 'Completed', value: completed },
  { name: 'Pending', value: pending }, // Pending tasks
];

  



    // Weekly Progress: Total points per week
const weeklyProgressData = [];

// Iterate over each week in completedTasks
Object.entries(completedTasks).forEach(([weekKey, weekData]) => {
  const weekIndex = parseInt(weekKey, 10);
  
  // Validate weekIndex and weekData
  if (isNaN(weekIndex) || typeof weekData !== 'object' || weekData === null) return;

  let weekPoints = 0;

  // Iterate over each day in the current week
  Object.entries(weekData).forEach(([dayKey, dayData]) => {
    const dayIndex = parseInt(dayKey, 10);
    
    // Validate dayIndex and dayData
    if (isNaN(dayIndex) || typeof dayData !== 'object' || dayData === null) return;

    // Calculate points: 5 points per completed exercise
    const completedExercises = Object.values(dayData).filter(Boolean).length;
    const points = completedExercises * 5; // 5 points per completed exercise

    // Accumulate points for the week
    weekPoints += points;
  });

  // Push the calculated weekly points into weeklyProgressData array
  weeklyProgressData.push({ week: `Week ${weekIndex + 1}`, points: weekPoints });
});

console.log(weeklyProgressData);

  
    return { activityData, taskPerformanceData, weeklyProgressData };
  };
  
  const { activityData, taskPerformanceData, weeklyProgressData } = prepareChartData();
  


  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  // Render error state
  if (error || !profileInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">{error || 'Error loading data.'}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>
        <div></div> {/* Placeholder for alignment */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points Card */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m5-7v7m-10-7v7m1-4a4 4 0 118 0v4H13v-4z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Points</p>
            <p className="text-xl font-semibold">{profileInfo.pointsEarned || 0}</p>
          </div>
        </div>

        {/* Workouts Completed Card */}
        <div className="bg-white shadow rounded-lg p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m5-7v7m-10-7v7m1-4a4 4 0 118 0v4H13v-4z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Workouts Completed</p>
            <p className="text-xl font-semibold">{profileInfo.workoutsCompleted || 0}</p>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <h2 className="text-2xl font-semibold mb-4">Activity Points Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="points" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Task Performance Pie Chart */}
      <h2 className="text-2xl font-semibold mb-4">Task Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={taskPerformanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            {taskPerformanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Weekly Progress Bar Chart */}
      <h2 className="text-2xl font-semibold mb-4">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyProgressData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="points" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Points;


