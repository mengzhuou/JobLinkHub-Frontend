import React, { useEffect, useState } from "react";
import RecordTable from "../../Functions/Table/RecordTable/RecordTable";
import './MainPage.css';

const MainPage = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Retrieve user info from localStorage
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        }
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="main-page-body">
            <div className="main-page-container">
                <div className="record-table-section">
                    <h3>
                        Welcome, {userInfo ? (userInfo.username || userInfo.name) : "Guest"}
                    </h3>
                    <RecordTable />
                </div>
            </div>
        </div>
    );
}

export default MainPage;
