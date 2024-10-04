import axios from 'axios';

// Configure your API key and endpoint here
const API_KEY = 'your-rapidapi-key'; // Replace with your actual API key
const BASE_URL = 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/list/equipment'; // The correct endpoint

// Setting up Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY, // Your API key
    'X-RapidAPI-Host': 'exercise-db-fitness-workout-gym.p.rapidapi.com',
  },
});

// Function to get exercise suggestions based on equipment
export const getExerciseSuggestions = async (query) => {
  try {
    const response = await api.get(`/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
