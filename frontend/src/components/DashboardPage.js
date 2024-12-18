// import React, { useState, useEffect} from "react";

const Dashboard = () => {
  // const [data, setData] = useState([]);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:4000/') // Backend API endpoint
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => setData(data))
  //     .catch((error) => setError(error.message));
  // }, []);

  return (
    <div className="dashboard">
      <h1>Welcome to BookMate</h1>
      <p>Track your favorite books, add friends, and share recommendations!</p>
    </div>
  );
};

export default Dashboard;
