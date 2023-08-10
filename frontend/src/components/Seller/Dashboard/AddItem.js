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


export default function AddItem({ closeEvent }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [pictures, setPictures] = useState([])
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const token = useSelector((state) => state.auth.token);

    const AddProduct = async() => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('pictures',pictures);
        for (let i = 0; i < pictures.length; i++) {
            formData.append('pictures', pictures[i]);
        }
        console.log(pictures);
        try {
            const response = await axios.post('http://localhost:5000/api/products',
                formData,
                {
                    headers: {
                        'x-auth-token': token, 
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if(response.status===200)
                alert("Product added successfully");
            else
                alert('product addition unsuccessful');
        } catch (error) {
            console.error('Product addition unsuccessful', error);
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
    const handleImageChange = (event) => {
        setPictures(event.currentTarget.files)

    }
    return (
        <>
            <Box sx={{ m: 2 }}>
                <Typography variant='h5' align='center' sx={{ marginBottom: "20px" }}>
                    Add Product
                </Typography>
                <IconButton style={{ position: 'absolute', top: '0', right: '0' }}
                    onClick={closeEvent}>
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
                        <TextField variant='outlined' onChange={handleImageChange} inputProps={{ accept: 'image/*', multiple: true }}
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
                    <Button variant='contained' onClick={AddProduct}>
                        Submit
                    </Button>
                </Box>

            </Box >
        </>
    )
}
