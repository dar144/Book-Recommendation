import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/Profile.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const RegisterPage = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        // const response = await axios.post('http://localhost:4000/register', {
        //     email: email,
        //     username: username,
        //     password: password
        // });

        const { data } = await register({email: email, username: username, password: password});
        setToken(data.token);
        navigate('/books');

        // if(response.data.success) {
        //     // Redirect to the specified page
        //     navigate(response.data.redirect);
        // }

        console.log("Registering with", { email, password });
        // Add your registration logic here (API call, etc.)
    };

    return (
        <div className="auth-page">
        <div className="auth-container">
            <h1>Register</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                />

                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                />

                <button type="submit">Register</button>
            </form>
            <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
                Log in here
            </Link>
            </p>
        </div>
        </div>
    );
};

export default RegisterPage;
