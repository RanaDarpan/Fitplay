import React from 'react';

const SocialInteraction = () => {
  const nearbyUsers = ['User1', 'User2', 'User3'];

  return (
    <div className="bg-white p-4 shadow-lg rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Nearby Users</h2>
      <ul className="list-disc pl-5">
        {nearbyUsers.map((user, index) => (
          <li key={index} className="mb-2">{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocialInteraction;
