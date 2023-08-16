import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Grid, Typography, TextField, FormControl, InputLabel, InputAdornment, IconButton, OutlinedInput } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

interface PaymentFormProps {
    cart: Product[];
    totalPrice: number;
}

interface Product {
    id: number;
    title: string;
    price: number;
    quantity: number;
    // ... other properties
}

const PaymentForm: React.FC<PaymentFormProps> = ({ cart, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setPaymentError(null);

        const cardElement = elements.getElement(CardElement);

        if (cardElement) {
            try {
                const { token } = await stripe.createToken(cardElement);
                // Send the token to your server or handle payment processing

                // If successful, setPaymentSuccess(true);
                // If there's an error, setPaymentError("Error message here");
            } catch (error) {
                setPaymentError("An error occurred while processing your payment.");
            }
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
                Complete Your Purchase
            </Typography>
            {paymentError && <Typography color="error">{paymentError}</Typography>}
            {paymentSuccess && (
                <Typography color="primary">Payment Successful! Thank you for your purchase.</Typography>
            )}
            <Typography variant="subtitle1">Items in Cart:</Typography>
            <ul>
                {cart.map(product => (
                    <li key={product.id}>
                        {product.title} - {product.quantity} x ${product.price}
                    </li>
                ))}
            </ul>
            <Typography variant="h6" style={{ margin: '10px' }}>
                Total: ${totalPrice}
            </Typography>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="card-element">Card Information</InputLabel>
                    <CardElement
                        id="card-element"
                        options={{
                        style: {
                            base: {
                            fontSize: '16px',
                            },
                        },
                        }}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center"> {/* Use justifyContent */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={loading ? <SendIcon /> : null}
                        disabled={!stripe || loading}
                    >
                        {loading ? 'Processing' : 'Pay Now'}
                    </Button>
                    </Grid>
                </Grid>
                </Grid>

            </form>
        </div>
    );
};

export default PaymentForm;
