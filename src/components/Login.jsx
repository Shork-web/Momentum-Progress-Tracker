import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(-45deg, 
    #007bff,
    #6610f2,
    #6f42c1,
    #e83e8c,
    #20c997,
    #17a2b8)`,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 10s ease infinite`, // Ensure 'infinite' is present
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.2rem',
  fontWeight: 'bold',
  borderRadius: '30px',
  transition: 'transform 0.2s ease-in-out, background-color 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
}));

function Login({ onLogin, onToggleSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <GradientBackground>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ maxWidth: 400 }}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" align="center">
            Welcome Back
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { color: 'white', borderColor: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { color: 'white', borderColor: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledButton
            variant="contained"
            fullWidth
            onClick={handleLogin}
            startIcon={<LoginIcon />}
          >
            Login
          </StyledButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <Button color="inherit" onClick={onToggleSignUp}>
              Sign Up
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </GradientBackground>
  );
}

export default Login;
