import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/signup/signup';
import Login from './components/login/login';
import NotFound from './components/others/NotFound';
import SellerDashboard from './components/Seller/Dashboard/Dashboard'
import BuyerDashboard from './components/Buyer/Dashboard/Dashboard'
import jwt_decode from 'jwt-decode';
import {useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Checkout from './components/Buyer/Checkout/Checkout';
import OrderPage from './components/Orders/Orders';
import UnAuthorized from './components/others/UnAuthorized';


interface DecodedToken{
  userType: string;
}
function App() {
  const token = useSelector((state:RootState) => state.auth.token);
  let userType: string | null = null;
  if (token) {
    const decodedToken: DecodedToken = jwt_decode(token);
    userType = decodedToken.userType;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={userType ? (userType==='buyer' ? <BuyerDashboard/> : <SellerDashboard/>) : <Login/>} />
        <Route path="/login" element={userType ? (userType==='buyer' ? <BuyerDashboard/> : <SellerDashboard/>) : <Login/>} />
        
        <Route path="/signup" element={<Signup/>} />
        
        <Route path="/checkout" element={userType ? (userType==='buyer' ? <Checkout/> : <UnAuthorized/>) : <Login/>}/>
        <Route path='/orders' element={userType ? <OrderPage/> : <Login/>}/>
        
        <Route path="*" element={<NotFound />} /> {/* This should be the last route */}
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
