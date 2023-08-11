import * as React from 'react';
import {useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, clearProducts } from '../../../redux/slices/product-slice.ts';
import Cart from '../Cart/cart.tsx';
import { incrementToCart, clearCart } from "../../../redux/slices/cart-slice.ts";
import { clearProfile } from '../../../redux/slices/profile-slice.ts';
import { clearAuthToken } from '../../../redux/slices/auth-slice.ts';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../../Profile/Profile.tsx';

interface Product {
    id: number;
    title: string;
    pictures: string[];
    description: string;
    price: number;
    quantity: number;
    // Add other properties as needed
}
const baseImageUrl = 'images/products/';

const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'pictures', label: 'Picture', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 100 },
    {
        id: 'price',
        label: 'Price',
        minWidth: 100,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 100,
        format: (value) => value.toLocaleString('en-US'),
    },
    // { id: 'actions', label: 'Actions', minWidth: 100 },
];

export default function BuyerDashboard() {
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.products);
    const token = useSelector((state: RootState) => state.auth.token);
    const cartProducts = useSelector((state: RootState) => state.cart.products);
    const navigate = useNavigate();
    useEffect(()=>{
        let count=0;
        for(let i=0; i<cartProducts.length; i++){
            count+=cartProducts[i].quantity;
        }
        setCartCount(count);
    },[cartProducts])


    const style: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    const handleAddToCart = (product) => {
        dispatch(incrementToCart(product));
        console.log(`Adding product '${product.title}' to cart.`);
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/', {
                headers: {
                    'x-auth-token': token 
                }
            });
            const responseData: Product[] = await response.json();
            dispatch(fetchProducts(responseData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    },[]);

    const logout = ()=>{
        dispatch(clearCart());
        dispatch(clearProducts());
        dispatch(clearProfile());
        dispatch(clearAuthToken());
        navigate('/login');
    }

    // ...

    return (
        <>
            <ProfilePage></ProfilePage>
            <div>
                {/* Cart */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Cart />
                    </Box>
                </Modal>
            </div>
            <Paper>
                <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ExitToAppIcon />}
                        onClick={logout}
                        sx={{
                            backgroundColor: '#ff5722',
                            '&:hover': {
                                backgroundColor: '#e64a19',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
                <Box sx={{ textAlign: "center", margin: "10px" }}>
                    <Button variant="contained" endIcon={<ShoppingCartIcon />} onClick={handleOpen}>
                        Cart({cartCount})
                    </Button>
                </Box>
                <TableContainer sx={{ margin: "10px", overflowX: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products ? (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {column.id === 'pictures' && Array.isArray(product[column.id]) ? (
                                                    <div>
                                                        {product[column.id].map((pictureUrl, index) => (
                                                            <img
                                                                key={index}
                                                                src={`${baseImageUrl}${pictureUrl}`}
                                                                style={{ maxWidth: '250px', marginRight: '5px' }}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : column.format ? (
                                                    column.format(product[column.id])
                                                ) : (
                                                    product[column.id]
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={() => handleAddToCart(product)}
                                                style={{
                                                    border: '1px solid #007bff',
                                                    borderRadius: '5px',
                                                    padding: '5px 10px',
                                                    color: '#007bff',
                                                    backgroundColor: 'transparent',
                                                    transition: 'background-color 0.3s, color 0.3s',
                                                }}
                                            >
                                                Add to Cart
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
    
}
