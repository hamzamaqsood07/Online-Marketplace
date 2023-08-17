import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Paper, Container, CircularProgress, AccordionActions } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { clearCart } from '../../../redux/slices/cart-slice';

const Checkout: React.FC = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const products = useSelector((state:RootState)=> state.cart.products)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToDashboard = ()=>{
        setTimeout(()=>{
            navigate('/buyer-dashboard');
        },2000)
    }   

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatusParam = queryParams.get('paymentStatus');
    if (paymentStatusParam) {
        setPaymentStatus(paymentStatusParam)
        postOrder();
    }
    else navigateToDashboard();
  }, []);

  const postOrder = async()=>{
    try{
        const response = await axios.post('http://localhost:5000/api/orders',
        {
            products: products
        },
        {
            headers:{
            'x-auth-token': token,
            }
        });
        console.log(response.data);
        dispatch(clearCart());
        navigateToDashboard();
    }
    catch (error) {
        console.error('Error posting data:', error);
    } 
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Paper style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} elevation={0}>
          {paymentStatus === 'success' ? (
            <>
              <Typography variant="h4" gutterBottom>
                Payment Successful
              </Typography>
              <Typography variant="body1">Thank you for your purchase!</Typography>
            </>
          ) : paymentStatus === 'canceled' ? (
            <>
              <Typography variant="h4" gutterBottom>
                Payment Canceled
              </Typography>
              <Typography variant="body1">If you have any questions, please contact support.</Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Payment Error
              </Typography>
              <Typography variant="body1">Something went wrong with your payment. Please try again later.</Typography>
            </>
          )}
          {paymentStatus === null && (
            <div style={{ marginTop: 20 }}>
              <CircularProgress />
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Checkout;
