// src/Components/Chatbot.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { FaArrowLeft } from 'react-icons/fa';
import { getExerciseSuggestions } from '../api/fitnessApi'; // Import the API function
import Header from './Header/Header'; // Adjust the path as necessary

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I assist you with your fitness and health today?' },
  ]);
  const [loading, setLoading] = useState(false); // For loading state during API request
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await getChatbotResponse(input);
      setLoading(false);

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
      }, 1000);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
      ]);
      setLoading(false);
      console.error("Error fetching bot response:", error);
    }
  };

  // Fetch chatbot response
  const getChatbotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('exercise') || message.includes('workout')) {
      const equipment = message.split(' ').find((word) => ['dumbbells', 'barbell', 'kettlebell', 'bench', 'machine'].includes(word));

      if (equipment) {
        try {
          console.log(`Fetching exercises for: ${equipment}`); // Debugging log
          const suggestions = await getExerciseSuggestions(equipment); // Fetch suggestions from the API

          console.log('API Response:', suggestions); // Debugging log

          if (suggestions && suggestions.length > 0) {
            return `Here are some exercises you can do with ${equipment}: ${suggestions.map(exercise => exercise.name).join(', ')}.`;
          } else {
            return `Sorry, I couldn't find exercises for ${equipment}. Please try asking about another type of equipment.`;
          }
        } catch (error) {
          console.error("Error fetching exercises:", error); // Debugging log
          return 'There was an error fetching exercises. Please try again.';
        }
      } else {
        return 'Can you specify which equipment you want exercises for? I can suggest workouts for dumbbells, barbells, kettlebells, benches, or machines.';
      }
    }

    return 'I can assist you with fitness-related queries. Please ask me about exercises or workouts!';
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Fitness Help Chatbot</h1>

        {/* Chat Window */}
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-4 flex flex-col mb-4">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 h-80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white self-end'
                    : 'bg-gray-200 text-gray-800 self-start'
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500">Bot is typing...</div> 
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field and Send Button */}
          <div className="flex space-x-2">
            <input
              type="text"
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask your fitness question..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>

        {/* Back to Dashboard Link */}
        <Link
          to="/dashboard"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Chatbot;
