import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/signup/signup.tsx';
import Login from './components/login/login.tsx';
import NotFound from './components/notfound.tsx';
import SellerDashboard from './components/Seller/Dashboard/Dashboard.js'
import BuyerDashboard from './components/Buyer/Dashboard/Dashboard.js'
import jwt_decode from 'jwt-decode';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function App() {
  const token = useSelector((state) => state.auth.token);

  let InitialRoute = Login;

  if (token) {
    const decodedToken = jwt_decode(token);
    const userType = decodedToken.userType;

    if (userType === 'buyer') {
      InitialRoute = BuyerDashboard;
    } else if (userType === 'seller') {
      InitialRoute = SellerDashboard;
    }
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialRoute/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/seller-dashboard" element={<SellerDashboard/>}/>
        <Route path="/buyer-dashboard" element={<InitialRoute/>}/>
        <Route path="*" element={<NotFound />} /> {/* This should be the last route */}
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
