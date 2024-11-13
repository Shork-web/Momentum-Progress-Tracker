import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Typography, Box, Grid, Paper, 
  InputAdornment, IconButton, FormControlLabel, Checkbox 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailIcon from '@mui/icons-material/Email';

// Services
import StorageService from '../services/storage';

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  backgroundImage: `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 4),
  borderRadius: 24,
  width: '100%',
  maxWidth: 600,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 30, 0.95)'
    : 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 40px rgba(0, 0, 0, 0.5)'
    : '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.3)'}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 50px rgba(0, 0, 0, 0.7)'
      : '0 12px 50px rgba(0, 0, 0, 0.18)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.03)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.03)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

function Login({ onLogin, onToggleSignUp }) {
  // State
  const [formState, setFormState] = useState({
    identifier: '',
    password: '',
    showPassword: false,
    errors: {},
    rememberMe: false
  });

  // Effects
  useEffect(() => {
    const remembered = StorageService.getRememberedUser();
    if (remembered) {
      setFormState(prev => ({
        ...prev,
        identifier: remembered.credential,
        rememberMe: true
      }));
    }
  }, []);

  // Handlers
  const handleInputChange = (field) => (event) => {
    setFormState(prev => ({
      ...prev,
      [field]: event.target.value,
      errors: {}
    }));
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleRememberMeChange = (event) => {
    setFormState(prev => ({
      ...prev,
      rememberMe: event.target.checked
    }));
  };

  const handleLogin = () => {
    const { identifier, password, rememberMe } = formState;
    const errors = {};
    
    // Validation
    if (!identifier) {
      errors.identifier = 'Username or email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    // Find user
    const users = StorageService.getUsers();
    const user = users.find(u => 
      u.username === identifier || u.email === identifier
    );

    if (user && user.password === password) {
      const sanitizedUser = {
        username: user.username,
        email: user.email,
        id: user.id,
        fullName: user.fullName,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString()
      };

      StorageService.updateUserLoginInfo(user.id);

      if (rememberMe) {
        StorageService.setRememberedUser('identifier', identifier);
      } else {
        StorageService.setRememberedUser(null, null);
      }

      onLogin(sanitizedUser);
    } else {
      setFormState(prev => ({ 
        ...prev, 
        errors: { auth: 'Invalid credentials' }
      }));
    }
  };

  // Render helpers
  const renderIdentifierField = () => (
    <Grid item xs={12}>
      <StyledTextField
        label="Username or Email"
        variant="outlined"
        fullWidth
        value={formState.identifier}
        onChange={handleInputChange('identifier')}
        error={!!formState.errors.identifier || !!formState.errors.auth}
        helperText={formState.errors.identifier || formState.errors.auth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon color={formState.errors.identifier || formState.errors.auth ? "error" : "action"} />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );

  const renderPasswordField = () => (
    <Grid item xs={12}>
      <StyledTextField
        label="Password"
        type={formState.showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        value={formState.password}
        onChange={handleInputChange('password')}
        error={!!formState.errors.password || !!formState.errors.auth}
        helperText={formState.errors.password || formState.errors.auth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon color={formState.errors.password || formState.errors.auth ? "error" : "action"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {formState.showPassword ? 
                  <VisibilityOffOutlinedIcon /> : 
                  <VisibilityOutlinedIcon />
                }
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );

  return (
    <GradientBackground>
      <StyledPaper elevation={4}>
        <Grid container spacing={3} sx={{ px: 4 }}>
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

          {renderIdentifierField()}
          {renderPasswordField()}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.rememberMe}
                  onChange={handleRememberMeChange}
                  color="primary"
                />
              }
              label="Remember me"
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
