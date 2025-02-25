import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ChatRoom from './ChatRoom';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:room" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default Main;