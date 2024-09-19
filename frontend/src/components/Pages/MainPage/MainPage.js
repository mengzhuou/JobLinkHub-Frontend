import React, { Component } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { withFuncProps } from "../../withFuncProps";
import RecordTable from "../../Functions/Table/RecordTable/RecordTable";
import './MainPage.css';
import { verifyGoogleLogin } from '../../../connector';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeInput: "",
            classTable: [],
            isAuthenticated: false,
            userInfo: null 
        };
    }

    componentDidMount() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (isAuthenticated && userInfo) {
            this.setState({ isAuthenticated, userInfo });
        }
    }

    handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        try {
            const response = await verifyGoogleLogin(token);
            console.log('User logged in successfully:', response);
    
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify(response.user));
    
            this.setState({ isAuthenticated: true, userInfo: response.user });
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    handleLoginError = () => {
        console.error('Google login failed');
    };

    render() {
        return (
            <div className="main-page-body">
                <div className="main-page-container">
                    {!this.state.isAuthenticated ? (
                        <div className="google-login-container">
                            <GoogleLogin
                                onSuccess={this.handleLoginSuccess}
                                onError={this.handleLoginError}
                            />
                        </div>
                    ) : (
                        <div className="record-table-section">
                            <h3>Welcome, {this.state.userInfo?.name}</h3>
                            <RecordTable />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withFuncProps(MainPage);
