import React, { useState } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState(['Welcome to Daily FitPlay!']);

  const handleNewNotification = () => {
    setNotifications([...notifications, 'New personalized challenge available!']);
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleNewNotification}
      >
        Simulate New Notification
      </button>
      <ul className="list-disc pl-5">
        {notifications.map((notification, index) => (
          <li key={index} className="mb-2">{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
