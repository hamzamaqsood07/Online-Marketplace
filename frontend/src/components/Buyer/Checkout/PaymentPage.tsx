import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PaymentForm from './PaymentForm';
import { Paper, Typography, Container } from '@mui/material';

const stripePromise = loadStripe('your_publishable_key');

const PaymentPage: React.FC = () => {
    const totalPrice = useSelector((state: RootState) => state.totalPrice.totalPrice);
    const cart = useSelector((state: RootState) => state.cart.products);

    return (
        <Container maxWidth="sm">
            <Paper style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
                    Checkout
                </Typography>
                <Elements stripe={stripePromise}>
                    <PaymentForm cart={cart} totalPrice={totalPrice} />
                </Elements>
            </Paper>
        </Container>
    );
};

export default PaymentPage;
