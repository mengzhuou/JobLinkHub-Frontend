import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Pages/MainPage/MainPage";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import Application from "./components/Pages/Application/Application" 
import Profile from "./components/ProfilePage/ProfilePage";
class App extends Component {

  render() {
    return (
      <Router>
        <TopNavBar/>
        <Routes>

          <Route path="/Application" element={<Application/>}/>
          <Route path="/profile" element={<Profile />} />

          <Route path="/" element={<Main/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
