import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";
import BooksPage from "./components/BooksPage";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import FollowsPage from "./components/FollowsPage";
import "./App.css";

function App() {
  // Initialize token state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Save or remove token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); // Save token
    } else {
      localStorage.removeItem("token"); // Clear token on logout
    }
  }, [token]);

  return (
    <Router>
      {/* Pass setToken as a prop to Navbar */}
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage setToken={setToken} />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/books" element={token ? <BooksPage /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="/follows" element={token ? <FollowsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
