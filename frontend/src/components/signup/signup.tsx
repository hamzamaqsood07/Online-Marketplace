import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../../styles/error.css';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  userType: Yup.string().required('User type is required'),
  profilePicture: Yup.mixed().required('Profile picture is required'),
});

export default function SignUp() {
  const navigate = useNavigate();
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'buyer',
    profilePicture: null,
  };

  const onSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      const url = 'http://localhost:5000/api/users';
      const response = await axios.post(url, values, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }});
      console.log('Signup successful', response.data);
      alert("Signup successful");
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  {...formik.getFieldProps('firstName')}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="error">{formik.errors.firstName}</div>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  {...formik.getFieldProps('lastName')}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="error">{formik.errors.lastName}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error">{formik.errors.password}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="userType"
                    defaultValue="buyer"
                    {...formik.getFieldProps('userType')}
                  >
                    <FormControlLabel
                      value="buyer"
                      control={<Radio />}
                      label="Buyer"
                    />
                    <FormControlLabel
                      value="seller"
                      control={<Radio />}
                      label="Seller"
                    />
                  </RadioGroup>
                </FormControl>
                {formik.touched.userType && formik.errors.userType && (
                  <div className="error">{formik.errors.userType}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="profilePicture" style={{ marginBottom: '8px', display: 'block' }}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={(event) => {
                    if(event.currentTarget.files && event.currentTarget.files.length>0){
                      console.log(event.currentTarget.files[0]);
                      formik.setFieldValue('profilePicture', event.currentTarget.files[0])}
                    }
                  }
                />
                {formik.touched.profilePicture && formik.errors.profilePicture && (
                  <div className="error">{formik.errors.profilePicture}</div>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
