import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    price: Yup.number().min(100, 'Price cannot be less than 100').required('Price is required'),
    quantity: Yup.number().min(1, 'Quantity must be greater than 0').required('Quantity is required'),
    description: Yup.string().required('Description is required'),
    pictures: Yup.array().min(1, 'At least one image is required'),
});


export default function EditItem(props) {
    const id = props.row.id;
    const [title, setTitle] = useState(props.row.title)
    const [description, setDescription] = useState(props.row.description)
    const [pictures, setPictures] = useState(props.row.pictures)
    const [price, setPrice] = useState(props.row.price)
    const [quantity, setQuantity] = useState(props.row.quantity)

    const token = useSelector((state) => state.auth.token);

    const EditProduct = async() => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('pictures',pictures);
        for (let i = 0; i < pictures.length; i++) {
            formData.append('pictures', pictures[i]);
        }
        console.log("pictures in edit",pictures);
        try {
            const response = await axios.put(`http://localhost:5000/api/products/${id}`,
                formData,
                {
                    headers: {
                        'x-auth-token': token, 
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if(response.status===200){
                await props.fetchCall();
                alert("Product updated successfully");
            }
            else
                alert('product updation unsuccessful');
        } catch (error) {
            console.error('Product updation unsuccessful', error);
            alert(error);
        }
    }


    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    }
    const handlePictureChange = (event) => {
        setPictures(event.currentTarget.files)

    }
    return (
        <>
            <Box sx={{ m: 2 }}>
                <Typography variant='h5' align='center' sx={{ marginBottom: "20px" }}>
                    Edit Product
                </Typography>
                <IconButton style={{ position: 'absolute', top: '0', right: '0' }}
                    onClick={props.closeEvent}>
                    <CloseIcon />
                </IconButton>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <TextField variant='outlined' label="Title" size="small" sx={{ minWidth: "100%" }} value={title} onChange={handleTitleChange} />
                    </Grid>

                    <Grid item xs={6} >
                        <TextField variant='outlined' value={price} onChange={handlePriceChange} label="Price" size="small" type='number' sx={{ minWidth: "100%" }} />
                    </Grid>
                    <Grid item xs={6} >
                        <TextField variant='outlined' value={quantity} onChange={handleQuantityChange} label="Quantity" size="small" type="number" sx={{ minWidth: "100%" }} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField variant='outlined' onChange={handlePictureChange} inputProps={{ accept: 'image/*', multiple: true }}
                            size="small" type="file" sx={{ minWidth: "100%" }} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            value={description} onChange={handleDescriptionChange}
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            maxRows={4}
                            size="small" sx={{ minWidth: "100%" }}
                        />                    </Grid>
                </Grid>
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                    <Button variant='contained' onClick={EditProduct}>
                        Submit
                    </Button>
                </Box>

            </Box >
        </>
    )
}
