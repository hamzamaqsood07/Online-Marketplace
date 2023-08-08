import * as React from 'react';
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
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const defaultTheme = createTheme();

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  userType: Yup.string().required('User type is required'),
  profilePicture: Yup.mixed().required('Profile picture is required'),
});

export default function SignUp() {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = 'http://localhost:5000/api/users';
      const response = await axios.post(url, values);
      console.log('Signup successful', response.data);
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };

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
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              userType: 'buyer',
              profilePicture: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                    <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                    <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                    <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                    <ErrorMessage name="password" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="userType"
                        name="userType"
                        defaultValue="buyer"
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
                    <ErrorMessage name="userType" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="profilePicture" style={{ marginBottom: '8px', display: 'block' }}>Profile Picture</label>
                    <Field
                      required
                      fullWidth
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      inputProps={{ accept: 'image/*' }}
                    />
                    <ErrorMessage name="profilePicture" component="div" className="error" style={{ color: 'red' }} />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
