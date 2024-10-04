import React, { useState, useEffect, useMemo } from "react";
import { firestore } from "../firebase/Firebase"; // Adjust the path as per your project structure
import { collection, getDocs } from "firebase/firestore";
import { computeTotalPoints } from "./utils/computeTotalPoints"; // Import the helper function
import Header from "./Header/Header"; // Import the Header component

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "points", direction: "descending" });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10; // Change this value to show more/less entries per page

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      setError(false);
      try {
        const usersCollection = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = [];

        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          const name = data.name || "Anonymous";
          const completedTasks = data.completedTasks || {};
          const avatar = data.avatar || "https://via.placeholder.com/150"; // Placeholder image
          const totalPoints = computeTotalPoints(completedTasks);
          usersList.push({
            id: doc.id,
            name,
            points: totalPoints,
            avatar,
          });
        });

        // Sort users by points descending
        const sortedUsers = usersList.sort((a, b) => b.points - a.points);

        // Assign ranks based on sorted order
        const rankedUsers = sortedUsers.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboardData(rankedUsers);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError(true);
      }
      setLoading(false);
    };

    fetchLeaderboardData();
  }, []);

  // Sorting functionality
  const sortedLeaderboard = useMemo(() => {
    let sortableData = [...leaderboardData];

    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Re-assign ranks after sorting
    return sortableData.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }, [leaderboardData, sortConfig]);

  // Filtered data based on search term
  const filteredLeaderboard = useMemo(() => {
    return sortedLeaderboard.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedLeaderboard, searchTerm]);

  // Function to request sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Pagination Logic
  const indexOfLastEntry = (currentPage + 1) * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredLeaderboard.slice(indexOfFirstEntry, indexOfLastEntry);

  // Function to change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Total Pages
  const totalPages = Math.ceil(filteredLeaderboard.length / entriesPerPage);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-purple-600 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Leaderboard</h1>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Loading and Error States */}
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
            <div className="text-center text-red-500">
              <p>Error fetching leaderboard data. Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Table for Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th
                        className="px-6 py-3 cursor-pointer select-none flex items-center"
                        onClick={() => requestSort("rank")}
                      >
                        Rank {sortConfig.key === "rank" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </th>
                      <th className="px-6 py-3">User</th>
                      <th
                        className="px-6 py-3 cursor-pointer select-none flex items-center"
                        onClick={() => requestSort("points")}
                      >
                        Points {sortConfig.key === "points" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map((user) => (
                      <tr
                        key={user.id}
                        className={`border-b ${
                          user.rank <= 3 ? "bg-gradient-to-r from-yellow-100 to-yellow-200" : "bg-white"
                        } hover:bg-gray-100 transition-colors duration-200`}
                      >
                        <td className="px-6 py-4 font-semibold">{user.rank}</td>
                        <td className="px-6 py-4 flex items-center">
                          <img
                            src={user.avatar}
                            alt={`${user.name}'s avatar`}
                            className="w-12 h-12 rounded-full mr-4"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150"; // Placeholder image
                            }}
                          />
                          <span className="text-gray-700">{user.name}</span>
                          {/* Highlight Top 3 with badges */}
                          {user.rank === 1 && (
                            <span className="ml-2 text-yellow-500" title="Top Performer">
                              🥇
                            </span>
                          )}
                          {user.rank === 2 && (
                            <span className="ml-2 text-gray-500" title="Second Place">
                              🥈
                            </span>
                          )}
                          {user.rank === 3 && (
                            <span className="ml-2 text-yellow-300" title="Third Place">
                              🥉
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards for Mobile View */}
              <div className="md:hidden space-y-4">
                {currentEntries.map((user) => (
                  <div
                    key={user.id}
                    className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg shadow ${
                      user.rank <= 3 ? "bg-gradient-to-r from-yellow-100 to-yellow-200" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-12 h-12 rounded-full mr-4"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150"; // Placeholder image
                        }}
                      />
                      <span className="text-gray-700">{user.name}</span>
                      {/* Highlight Top 3 with badges */}
                      {user.rank === 1 && (
                        <span className="ml-2 text-yellow-500" title="Top Performer">
                          🥇
                        </span>
                      )}
                      {user.rank === 2 && (
                        <span className="ml-2 text-gray-500" title="Second Place">
                          🥈
                        </span>
                      )}
                      {user.rank === 3 && (
                        <span className="ml-2 text-yellow-300" title="Third Place">
                          🥉
                        </span>
                      )}
                    </div>
                    <span className="text-gray-700">{user.points}</span>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                    } hover:bg-indigo-500 hover:text-white transition-colors duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
