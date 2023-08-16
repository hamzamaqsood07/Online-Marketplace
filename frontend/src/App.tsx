import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/signup/signup';
import Login from './components/login/login';
import NotFound from './components/notfound';
import SellerDashboard from './components/Seller/Dashboard/Dashboard.js'
import BuyerDashboard from './components/Buyer/Dashboard/Dashboard.js'
import jwt_decode from 'jwt-decode';
import {useSelector } from 'react-redux';
import PaymentPage from './components/Buyer/Checkout/PaymentPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { RootState } from './redux/store';

const stripePromise = loadStripe('your_publishable_key');

interface DecodedToken{
  userType: string;
}
function App() {
  const token = useSelector((state:RootState) => state.auth.token);

  let InitialRoute = Login;

  if (token) {
    const decodedToken: DecodedToken = jwt_decode(token);
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
        <Route path="/login" element={<InitialRoute/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/seller-dashboard" element={<InitialRoute/>}/>
        <Route path="/buyer-dashboard" element={<InitialRoute/>}/>
        <Route path="/payment" element={<Elements stripe={stripePromise}><PaymentPage /></Elements>}/>
        
        <Route path="*" element={<NotFound />} /> {/* This should be the last route */}
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
