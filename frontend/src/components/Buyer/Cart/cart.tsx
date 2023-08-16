import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { removeFromCart, incrementToCart, decrementFromCart, Product } from '../../../redux/slices/cart-slice';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { setTotalPrice } from '../../../redux/slices/totalPrice-slice';
import axios from 'axios';

const CartPage: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRemoveFromCart = (productId: number) => {
        dispatch(removeFromCart(productId));
    };

    const handleIncrementQuantity = (product: Product) => {
        dispatch(incrementToCart(product));
    };

    const handleDecrementQuantity = (productId: number) => {
        dispatch(decrementFromCart(productId));
    };

    const calculateTotalPrice = () => {
        return cart.products.reduce((total, product) => {
            return total + product.price * product.quantity;
        }, 0);
    };

    const checkout = () => {
        const totalPrice = calculateTotalPrice();
        dispatch(setTotalPrice(totalPrice));
        axios.post("http://localhost:5000/api/payment/create-checkout-session",{totalPrice:totalPrice})
        // navigate('/payment');
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Cart
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => handleDecrementQuantity(product.id)}>
                                        -
                                    </Button>
                                    {product.quantity}
                                    <Button size="small" onClick={() => handleIncrementQuantity(product)}>
                                        +
                                    </Button>
                                </TableCell>
                                <TableCell>{(product.price * product.quantity)}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="secondary" onClick={() => handleRemoveFromCart(product.id)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Total: {calculateTotalPrice()}
                </Typography>
                <Button variant="contained" color="primary" onClick={checkout}>
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default CartPage;
