import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { verifyGoogleLogin, registerUser, loginUser } from '../../connector'; // Add register and login methods

const LandingPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [formType, setFormType] = useState('login'); // Switch between login and register forms
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (storedIsAuthenticated && storedUserInfo) {
            setIsAuthenticated(true);
            setUserInfo(storedUserInfo);
        }
    }, []);

    const handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        try {
            const response = await verifyGoogleLogin(token);
            console.log('User logged in successfully:', response);

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));

            setIsAuthenticated(true);
            setUserInfo(response.user);
            navigate('/MainPage');
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    const handleLoginError = () => {
        console.error('Google login failed');
    };

    // Handle manual registration
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await registerUser({ username, password, confirmPassword });
            console.log('User registered successfully:', response);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            setUserInfo(response.user);
            navigate('/MainPage');
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            }
        }
    };

    // Handle manual login
    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            console.log('User logged in successfully:', response);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            setUserInfo(response.user);
            navigate('/MainPage');
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            }
        }
    };

    return (
        <div className="landing-container">
            <div className="overlay">
                <div className="landing-content">
                    <h1>Welcome to JobLinkHub</h1>
                    <p>Your one-stop solution for job applications and career growth</p>
                    {isAuthenticated && <p>Welcome back, {userInfo.username || userInfo.name}</p>}
                </div>
                
                {/* Conditionally render the auth-container only when user is not authenticated */}
                {!isAuthenticated && (
                    <div className="auth-container">
                        {formType === 'login' ? (
                            <form onSubmit={handleManualLogin}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Login</button>
                                <p onClick={() => setFormType('register')}>Don't have an account? Register here.</p>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Register</button>
                                <p onClick={() => setFormType('login')}>Already have an account? Login here.</p>
                            </form>
                        )}
                        <div className="divider">
                            <span>or</span>
                        </div>
                        <div className="google-login">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginError}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LandingPage;
