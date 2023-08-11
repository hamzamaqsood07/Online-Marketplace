import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddItem from './AddItem.tsx';
import EditItem from './EditItem.tsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {fetchProducts, clearProducts} from '../../../redux/slices/product-slice.ts'
import axios from 'axios';
import ProfilePage from '../../Profile/Profile.tsx';
import { useNavigate } from 'react-router-dom';
import { clearProfile } from '../../../redux/slices/profile-slice.ts';
import { clearAuthToken } from '../../../redux/slices/auth-slice.ts';


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


];



export default function SellerDashboard() { 
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const [currRow, setCurrRow] = useState(null)
    const token = useSelector((state) => state.auth.token);
    const products = useSelector((state)=>state.products.products);
    const navigate = useNavigate();
    

    
    
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/me', {
                headers: {
                    'x-auth-token': token // Set the 'x-auth-token' header
                }
            });
            const responseData = await response.json();
            dispatch(fetchProducts(responseData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    },[]);
    
    

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleEdit = (row) => {
        handleOpenEdit();
        setCurrRow(row)
    }

    const logout = ()=>{
        dispatch(clearProducts());
        dispatch(clearProfile());
        dispatch(clearAuthToken());
        navigate('/login');
    }


    const handleDelete = async(row) => {
        //Write the APIs for delete here
        try{
            const response = await axios.delete(`http://localhost:5000/api/products/${row.id}`,
                {
                    headers: {
                        'x-auth-token': token, 
                    },
                }
            );
            if(response.status===200){
                alert("Product deleted successfully");
                fetchData();
            }
            else
                alert('product deletion unsuccessful');
        } catch (error) {
            console.error('Product deletion unsuccessful', error);
            alert(error);
        }
    };


    return (
        <>
            <ProfilePage></ProfilePage>
            <div>
                {/* Add Product Page */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <AddItem closeEvent={handleClose} />
                    </Box>
                </Modal>

                {/* Edit Product Page */}
                <Modal
                    open={openEdit}
                    onClose={handleCloseEdit}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <EditItem closeEvent={handleCloseEdit} row={currRow} fetchCall={fetchData} />
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
                    backgroundColor: '#ff5722', // Change this color to your desired logout button color
                    '&:hover': {
                        backgroundColor: '#e64a19', // Change this color to your desired hover color
                    },
                    }}
                >
                    Logout
                </Button>
                </Box>
                <Box sx={{ textAlign: "center",        marginTop: "10px" }}>
                    <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
                        Add Product
                    </Button>
                </Box>

                <TableContainer sx={{ margin: "10px" }}>
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
                            {
                                products.map((row) =>
                                (
                                    <TableRow key={row.id}>
                                        {
                                            columns.map((column) => {
                                                return (
                                                    <TableCell key={column.id} >
                                                        {column.id === 'pictures' && Array.isArray(row[column.id]) ? (
                                                            <div>
                                                                {row[column.id].map((pictureUrl, index) =>(
                                                                        <img
                                                                            key={index}
                                                                            src={`${baseImageUrl}${pictureUrl}`}
                                                                            style={{ maxWidth: '250px', marginRight: '5px' }}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : column.format ? (
                                                            column.format(row[column.id])
                                                        ) : (
                                                            row[column.id]
                                                        )}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                        <TableCell align="center">

                                            <IconButton onClick={() => handleEdit(row)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(row)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper >
        </>

    );
}