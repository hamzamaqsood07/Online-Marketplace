import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import axios from 'axios';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  price: Yup.number().min(100, 'Price cannot be less than 100').required('Price is required'),
  quantity: Yup.number().min(1, 'Quantity must be greater than 0').required('Quantity is required'),
  description: Yup.string().required('Description is required'),
  pictures: Yup.array().min(1, 'At least one image is required'),
});

export default function AddItem({ closeEvent }) {
  const token = useSelector((state) => state.auth.token);

  const AddProduct = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('quantity', values.quantity);
    for (let i = 0; i < values.pictures.length; i++) {
      formData.append('pictures', values.pictures[i]);
    }
    console.log(values.pictures);
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
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        title: '',
        price: '',
        quantity: '',
        description: '',
        pictures: [],
      }}
      validationSchema={validationSchema}
      onSubmit={AddProduct}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ m: 2 }}>
            <Typography variant="h5" align="center" sx={{ marginBottom: '20px' }}>
              Add Product
            </Typography>
            <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={closeEvent}>
              <CloseIcon />
            </IconButton>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  type="text"
                  name="title"
                  as={TextField}
                  variant="outlined"
                  label="Title"
                  size="small"
                  sx={{ minWidth: '100%' }}
                />
                <ErrorMessage name="title" component="div" className="error" />
              </Grid>

              <Grid item xs={6}>
                <Field
                  type="number"
                  name="price"
                  as={TextField}
                  variant="outlined"
                  label="Price"
                  size="small"
                  sx={{ minWidth: '100%' }}
                />
                <ErrorMessage name="price" component="div" className="error" />
              </Grid>
              <Grid item xs={6}>
                <Field
                  type="number"
                  name="quantity"
                  as={TextField}
                  variant="outlined"
                  label="Quantity"
                  size="small"
                  sx={{ minWidth: '100%' }}
                />
                <ErrorMessage name="quantity" component="div" className="error" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  type="file"
                  name="pictures"
                  multiple
                  as={TextField}
                  inputProps={{ accept: 'image/*', multiple: true }}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: '100%' }}
                />
                <ErrorMessage name="pictures" component="div" className="error" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="description"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  label="Description"
                  size="small"
                  sx={{ minWidth: '100%' }}
                />
                <ErrorMessage name="description" component="div" className="error" />
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
