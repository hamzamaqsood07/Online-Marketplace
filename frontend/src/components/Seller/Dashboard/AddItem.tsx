import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../../../styles/error.css'
import { RootState } from '../../../redux/store';

const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    quantity: yup.number().required('Quantity is required').positive('Quantity must be a positive number'),
    description: yup.string().required('Description is required'),
});

interface Props {
    closeEvent: () => void;
}

const AddItem: React.FC<Props> = ({ closeEvent }) => {
    const [pictures, setPictures] = useState<File[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            quantity: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('quantity', values.quantity);
            pictures.forEach((picture) => {
                formData.append('pictures', picture);
            });
            
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/products',
                    formData,
                    {
                        headers: {
                            'x-auth-token': token,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                if (response.status === 200) alert('Product added successfully');
                else alert('Product addition unsuccessful');
            } catch (error) {
                console.error('Product addition unsuccessful', error);
                alert(error);
            }
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPictures(Array.from(event.target.files));
        }
    };

    return (
        <>
            <Box sx={{ m: 2 }}>
                <Typography variant='h5' align='center' sx={{ marginBottom: '20px' }}>
                    Add Product
                </Typography>
                <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={closeEvent}>
                    <CloseIcon />
                </IconButton>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                label='Title'
                                size='small'
                                sx={{ minWidth: '100%' }}
                                name='title'
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title ? (
                                <div className='error'>{formik.errors.title}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label='Price'
                                size='small'
                                type='number'
                                name='price'
                                sx={{ minWidth: '100%' }}
                            />
                            {formik.touched.price && formik.errors.price ? (
                                <div className='error'>{formik.errors.price}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label='Quantity'
                                size='small'
                                type='number'
                                name='quantity'
                                sx={{ minWidth: '100%' }}
                            />
                            {formik.touched.quantity && formik.errors.quantity ? (
                                <div className='error'>{formik.errors.quantity}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                onChange={handleImageChange}
                                inputProps={{ accept: 'image/*', multiple: true }}
                                size='small'
                                type='file'
                                sx={{ minWidth: '100%' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id='outlined-multiline-flexible'
                                label='Description'
                                multiline
                                maxRows={4}
                                size='small'
                                name='description'
                                sx={{ minWidth: '100%' }}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className='error'>{formik.errors.description}</div>
                            ) : null}
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button variant='contained' type='submit'>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default AddItem;