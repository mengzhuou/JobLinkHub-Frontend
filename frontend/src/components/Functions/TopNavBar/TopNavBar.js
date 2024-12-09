import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import './TopNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { googleLogout } from '@react-oauth/google';

class TopNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDroppedDown: false,
            isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        };
        this.dropdownRef = React.createRef(); // Create a ref for the dropdown
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        // Check if click was outside the dropdown
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ isDroppedDown: false });
        }
    }

    toggleDropdown = () => {
        this.setState((prevState) => ({ isDroppedDown: !prevState.isDroppedDown }));
    }

    batchUploadNav = () => {
        this.props.navigate("/batch-upload");
        this.toggleDropdown();
    };

    applicationNav = () => {
        this.props.navigate("/Application");
        this.toggleDropdown();
    };

    logoutNav = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');

        googleLogout();

        this.props.navigate("/");
        window.location.reload();
        this.setState({ isDroppedDown: false, isAuthenticated: false });
    };

    profileNav = () => {
        this.props.navigate("/profile");
        this.toggleDropdown();
    };

    mainpageNav = () => {
        this.props.navigate("/MainPage");
        this.toggleDropdown();
    };

    loginNav = () => {
        this.props.navigate("/");
        this.toggleDropdown();
    };

    navigateHome = () => {
        const { isAuthenticated } = this.state;
        
        if (isAuthenticated) {
            this.props.navigate("/MainPage");
        } else {
            alert("You need to log in first to access Job Link Hub.");
            this.props.navigate("/");
        }
    };

    render() {
        const { isDroppedDown, isAuthenticated } = this.state;
        return (
            <div className="navBar">
                <div className="navBar-left">
                    <div className="navTitle" onClick={this.navigateHome}>
                        Job Link Hub
                    </div>
                </div>
                <div className="navBar-right">
                    <div className="userIcon" onClick={this.toggleDropdown}>
                        <FontAwesomeIcon icon={faCircleUser} />
                    </div>
                    <div className="dropdownIcon" ref={this.dropdownRef}>
                        <FontAwesomeIcon icon={isDroppedDown ? faAngleUp : faAngleDown} onClick={this.toggleDropdown} />
                        {isDroppedDown && (
                            <div className="dropdown-container">
                                {isAuthenticated ? (
                                    <>
                                        <div className="dropdown-content" onClick={this.mainpageNav}>Main Page</div>                                        
                                        <div className="dropdown-content" onClick={this.applicationNav}>Create Application</div>
                                        <div className="dropdown-content" onClick={this.profileNav}>Applied Application</div>
                                        <div className="dropdown-content" onClick={this.batchUploadNav}>Batch Upload</div>
                                        <div className="dropdown-content" onClick={this.logoutNav}>Logout</div>
                                    </>
                                ) : (
                                    <div className="dropdown-content" onClick={this.loginNav}>Log In</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default withFuncProps(TopNavBar);
