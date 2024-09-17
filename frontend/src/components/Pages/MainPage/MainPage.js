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

    handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        try {
            const user = await verifyGoogleLogin(token);
            console.log('User logged in successfully:', user);
    
            this.setState({ isAuthenticated: true, userInfo: user });
        } catch (error) {
            console.error('Google login failed:', error);
        }
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
