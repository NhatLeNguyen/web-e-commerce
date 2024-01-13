import * as React from 'react';
import { useNavigate } from 'react-router-dom';

//mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//data user
import { userInfo } from '~/data/userInfo';

import classNames from 'classnames/bind';
import styles from './login-register.module.scss';

const cx = classNames.bind(styles);

const defaultTheme = createTheme();
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        LEE Basketball
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}
//User login
export default function UserLoginScreen() {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const enteredEmail = data.get('email');
    const enteredPassword = data.get('password');
    const user = userInfo.find((user) => user.email === enteredEmail && user.password === enteredPassword);
    if (user) {
      if (user.role === 'user') {
        // Redirect to home page for users
        navigate('/user'); // Update '/home' with your home page route
      } else {
        // Handle other roles as needed
        console.log('Login successful:', user);
      }
    } else {
      // Login failed, handle error (e.g., show error message)
      console.log('Login failed. Invalid credentials.');
    }

    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <div className={cx(styles.login)}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box className={cx(styles.Form)}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/user-register" variant="body2">
                    Sign Up
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/admin-login" variant="body2">
                    Sign in as administrator
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 10, mb: 4, color: 'white' }} />
        </Container>
      </ThemeProvider>{' '}
    </div>
  );
}
