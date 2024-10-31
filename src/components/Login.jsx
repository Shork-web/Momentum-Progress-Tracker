import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Paper, InputAdornment, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(-45deg, 
    #2C3E50,
    #3498DB,
    #2980B9,
    #34495E)`,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: 24,
  width: '100%',
  maxWidth: 450,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.18)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  fontSize: '1.1rem',
  borderRadius: 12,
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

function Login({ onLogin, onToggleSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      <StyledPaper elevation={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              fontWeight="800"
              sx={{ 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 4
              }}
            >
              Welcome Back
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
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
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: 'text.secondary',
                mt: 2
              }}
            >
              Don't have an account?{' '}
              <Button 
                onClick={onToggleSignUp}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </GradientBackground>
  );
}

export default Login;
