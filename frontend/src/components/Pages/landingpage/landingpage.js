import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { verifyGoogleLogin, registerUser, loginUser } from '../../../connector';

const LandingPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [formType, setFormType] = useState('login');
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

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);

            setIsAuthenticated(true);
            setUserInfo(response.user);
            navigate('/MainPage');
            window.location.reload();
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    const handleLoginError = () => {
        console.error('Google login failed');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await registerUser({ username, password, confirmPassword });

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);

            setIsAuthenticated(true);
            setUserInfo(response.user);
            navigate('/MainPage');
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            }
        }
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            
            setIsAuthenticated(true);
            setUserInfo(response.user);
            navigate('/MainPage');
            window.location.reload();
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
                    {isAuthenticated && 
                        <p>Welcome back, {userInfo.username || userInfo.name}</p>
                    }
                </div>
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
                                <p>Don't have an account? <span onClick={() => setFormType('register')}>Register here.</span></p>
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
                                <p>Already have an account? <span onClick={() => setFormType('login')}>Login here.</span></p>
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
