import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'


export default function AddItem({ closeEvent }) {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [images, setImages] = useState([])
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)

    const CreateUser = () => {
        console.log(name, desc, price, quantity, images)
    }


    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    }
    const handleDescChange = (event) => {
        setDesc(event.target.value);
    }
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    }
    const handleImageChange = (event) => {
        setImages(event.currentTarget.files)

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
                        <TextField variant='outlined' label="Name" size="small" sx={{ minWidth: "100%" }} value={name} onChange={handleNameChange} />
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
                            value={desc} onChange={handleDescChange}
                            id="outlined-multiline-flexible"
                            label="Description"
                            multiline
                            maxRows={4}
                            size="small" sx={{ minWidth: "100%" }}
                        />                    </Grid>
                </Grid>
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                    <Button variant='contained' onClick={CreateUser}>
                        Submit
                    </Button>
                </Box>

            </Box >
        </>
    )
}
