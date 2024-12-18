import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../styles/LoginRegister.css';
// import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = ({ setToken }) => {
    const [email, setEmail] = useState("");
    // const [username, setUsername] = useStatse("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("hello");
  
        // const response = await axios.post('http://localhost:4000/login', {
        //     email: email,
        //     password: password
        // });

        const { data } = await login({email: email, password: password});
        setToken(data.token);
        // setUsername(data.username);
        // console.log("token " + data.token);
        // console.log("username " + data.username + " " + username);
        navigate('/profile');
                
        // console.log("Logging in with", { email, password });
        // Add your login logic here (API call, authentication, etc.)
    };

    return (
        <div className="auth-page">
        <div className="auth-container">
            <h1>Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
                    required
                />

                <button type="submit">Log In</button>
            </form>
            <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
                Register here
            </Link> 
            </p>
        </div>
        </div>
    );
};

export default LoginPage;
