import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/signup/signup.tsx';
import Login from './components/login/login.tsx';
import NotFound from './components/notfound.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="*" element={<NotFound />} /> {/* This should be the last route */}
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
