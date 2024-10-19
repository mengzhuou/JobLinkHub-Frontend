import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Pages/MainPage/MainPage";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import Application from "./components/Pages/Application/Application" 
import Profile from "./components/Pages/ProfilePage/ProfilePage";
import LandingPage from "./components/Pages/landingpage/landingpage";
import EditRecordForm from './components/Pages/EditRecordPage/EditRecordPage';
import BatchUpload from './components/Pages/BatchUpload/BatchUpload';

class App extends Component {

  render() {
    return (
      <Router>
        <TopNavBar/>
        <Routes>

          <Route path="/Application" element={<Application/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<EditRecordForm />}/>
          <Route path="/MainPage" element={<Main/>} />
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/batch-upload" element={<BatchUpload/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
