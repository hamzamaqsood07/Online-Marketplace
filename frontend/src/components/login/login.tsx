import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import '../../styles/error.css';
import { useSelector , useDispatch } from 'react-redux';
import { setAuthToken } from '../../redux/slices/auth-slice.ts';
import { RootState } from '../../redux/store.ts';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Import jwt-decode library
import { useNavigate } from 'react-router-dom';
import { setProfile } from '../../redux/slices/profile-slice.ts';



function SignInSide() {
  const authenticationStatus = useSelector((state: RootState) => state.auth.authenticationStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = 'http://localhost:5000/api/auth';
      const response = await axios.post(url, {
        email: values.email,
        password: values.password,
      });
      const token = response.data.token;

      // Decode the JWT token
      const decodedToken: any = jwt_decode(token);
      dispatch(setAuthToken(response.data.token));
      dispatch(setProfile(decodedToken));
      console.log("decodedToken:",decodedToken);

      // Access the userType claim
      const userType: string = decodedToken.userType;
      console.log('Login successful', response.data);
      // Navigate based on userType
      if (userType === 'buyer') {
        // Navigate to buyer route
        navigate('/buyer-dashboard');
      } else if (userType === 'seller') {
        // Navigate to seller route
        navigate('/seller-dashboard');
      }

    } catch (error) {
      console.log('Login failed', error);
      alert(console.error);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    console.log('Updated authenticationStatus:', authenticationStatus);
  }, [authenticationStatus]);


  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(marketplace.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Formik
              initialValues={{
                email: '',
                password: '',
                rememberMe: false, // Add rememberMe field
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form noValidate>
                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <ErrorMessage name="email" component="div" className="error" />

                  <Field
                    as={TextField}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <ErrorMessage name="password" component="div" className="error" />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={values.rememberMe}
                        onChange={() => setFieldValue('rememberMe', !values.rememberMe)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link 
                      component={RouterLink} // Use RouterLink component
                      to="/signup" // Set the target route here
                      variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;
