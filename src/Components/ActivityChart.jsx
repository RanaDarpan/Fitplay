// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const ActivityChart = ({ activityData = [] }) => {
//   const data = {
//     labels: activityData.length > 0 ? activityData.map((entry) => entry.day) : ['No Data'], // Safe check for empty data
//     datasets: [
//       {
//         label: 'Points Collected Day-by-Day',
//         data: activityData.length > 0 ? activityData.map((entry) => entry.points) : [0], // Safe check for empty data
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: true,
//         tension: 0.3,
//         pointBackgroundColor: 'rgba(255, 99, 132, 1)',
//         pointBorderColor: 'rgba(255, 99, 132, 1)',
//         pointHoverRadius: 6,
//         pointRadius: 4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Days of the Week',
//           color: '#333',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Points Collected',
//           color: '#333',
//         },
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         bodyColor: '#fff',
//         titleColor: '#fff',
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-lg">
//       <h3 className="text-xl font-bold mb-4 text-center">Your Progress (Points Collected)</h3>
//       <div className="h-64">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default ActivityChart;


// // src/Components/ActivityChart.jsx

// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const ActivityChart = ({ activityData = [] }) => {
//   // Filter to show the last 5 days, or less if data is shorter
//   const displayedData = activityData.slice(-5);

//   const data = {
//     labels: displayedData.map((entry) => entry.day),
//     datasets: [
//       {
//         label: 'Points Collected Day-by-Day',
//         data: displayedData.map((entry) => entry.points),
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: true,
//         tension: 0.3,
//         pointBackgroundColor: 'rgba(255, 99, 132, 1)',
//         pointBorderColor: 'rgba(255, 99, 132, 1)',
//         pointHoverRadius: 6,
//         pointRadius: 4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Days of the Week',
//           color: '#333',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Points Collected',
//           color: '#333',
//         },
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         bodyColor: '#fff',
//         titleColor: '#fff',
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-lg">
//       <h3 className="text-xl font-bold mb-4 text-center">Your Progress (Last 5 Days)</h3>
//       <div className="h-64">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default ActivityChart;


// src/Components/ActivityChart.jsx

// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const ActivityChart = ({ activityData = [] }) => {
//   // Filter to show the last 5 days, or less if data is shorter
//   const displayedData = activityData.slice(-5);

//   const data = {
//     labels: displayedData.map((entry) => entry.day),
//     datasets: [
//       {
//         label: 'Points Collected Day-by-Day',
//         data: displayedData.map((entry) => entry.points),
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: true,
//         tension: 0.3,
//         pointBackgroundColor: 'rgba(255, 99, 132, 1)',
//         pointBorderColor: 'rgba(255, 99, 132, 1)',
//         pointHoverRadius: 6,
//         pointRadius: 4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Days of the Week',
//           color: '#333',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Points Collected',
//           color: '#333',
//         },
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//         bodyColor: '#fff',
//         titleColor: '#fff',
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-lg">
//       <h3 className="text-xl font-bold mb-4 text-center">
//         Your Progress (Last 5 Days)
//       </h3>
//       <div className="h-64">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default ActivityChart;



// src/Components/ActivityChart.jsx





import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ActivityChart = ({ activityData = [] }) => {
  // Display only the last 5 days
  const displayedData = activityData.slice(-5);

  const data = {
    labels: displayedData.length > 0 ? displayedData.map((entry) => entry.day) : ['No Data'], // Safe check for empty data
    datasets: [
      {
        label: 'Points Collected Day-by-Day',
        data: displayedData.length > 0 ? displayedData.map((entry) => entry.points) : [0], // Safe check for empty data
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: 'rgba(255, 99, 132, 1)',
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
          color: '#333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Points',
          color: '#333',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">
        Your Progress (Last 5 Days)
      </h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ActivityChart;
