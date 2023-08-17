import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { removeFromCart, incrementToCart, decrementFromCart, clearCart } from '../../../redux/slices/cart-slice';
import { Product } from '../../../redux/slices/product-slice';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const CartPage: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const productsInStore = useSelector((state:RootState)=>state.products.products);
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

    const handleClearCart = () => {
        dispatch(clearCart()); // Call the clearCart() reducer action
    };

    const checkout = () => {
        console.log(cart.products);
        if(cart.products && cart.products.length>0){
            let stockAvailable = true;
            for(let i=0; i<cart.products.length; i++){
                let productInCart = cart.products[i];
                let productInStore = productsInStore.find(product=>product.id===productInCart.id);
                if(!productInStore){
                    alert('fatal error!');
                    stockAvailable = false;
                    break
                }
                else if(productInCart.quantity>productInStore.quantity){
                    alert('Check the quantity of items in dashboard')
                    stockAvailable = false;
                    break;
                }
            }
            if(stockAvailable)
            {
                try{
                    axios.post("http://localhost:5000/api/payment/create-checkout-session",
                        {products:cart.products}).
                        then((response) => {
                            if(response.data.url){    
                                window.location.href=response.data.url;
                                console.log("url: ",response.data.url);
                            }
                        }
                    );
                }
                catch(error){
                    console.log(error);
                }
            }
        }
        else alert('cart is empty!');
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
                <Button variant="outlined" color="secondary" onClick={handleClearCart}>
                    Clear Cart
                </Button>
            </div>
        </div>
    );
};

export default CartPage;
