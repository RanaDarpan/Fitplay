import React, { useState } from 'react';
import { logActivity } from '../firebase/ActivityLogger'; // Adjust import based on your file structure

const ActivityLogger = ({ userId }) => {
  const [activity, setActivity] = useState("");
  const [message, setMessage] = useState("");

  const handleActivityLog = async () => {
    try {
      await logActivity(userId, activity);
      setMessage("Activity logged successfully!");
      setActivity(""); // Clear input after logging
    } catch (error) {
      setMessage(error.message); // Display error message to user
    }
  };

  return (
    <div className="activity-logger">
      <h2>Log Your Activity</h2>
      <input
        type="text"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="Enter activity name"
      />
      <button onClick={handleActivityLog}>Log Activity</button>
      {message && <p>{message}</p>} {/* Display messages to user */}
    </div>
  );
};

export default ActivityLogger;
