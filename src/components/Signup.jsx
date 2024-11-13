import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Grid, Paper, 
  InputAdornment, IconButton, FormControlLabel, Checkbox,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailIcon from '@mui/icons-material/Email';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

// Components
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Services
import StorageService from '../services/storage';

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  backgroundImage: theme.palette.mode === 'dark' 
    ? 'linear-gradient(to bottom right, #1a1a1a, #2d3436)'
    : `url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')`,
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

function SignUp({ onSignUp, onToggleLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false,
    showPassword: false
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSignUp = () => {
    if (!validateForm()) return;

    const users = StorageService.getUsers();
    
    if (users.some(user => user.username === formData.username)) {
      setErrors(prev => ({ ...prev, username: 'Username already exists' }));
      return;
    }
    if (users.some(user => user.email === formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Email already exists' }));
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      createdAt: new Date().toISOString(),
      id: Date.now(),
      loginCount: 0,
      lastLogin: null
    };

    users.push(newUser);
    StorageService.setUsers(users);
    StorageService.setTasks(formData.username, []);
    StorageService.setMilestones(formData.username, []);
    
    setOpenSnackbar(true);
    
    setTimeout(() => {
      onSignUp();
    }, 2000);
  };

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
              textAlign="center"
              sx={{ 
                background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Create Account
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Personal Information
              </Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Full Name"
              fullWidth
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
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
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Password"
              type={formData.showPassword ? 'text' : 'password'}
              fullWidth
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {formData.showPassword ? 
                        <VisibilityOffOutlinedIcon /> : 
                        <VisibilityOutlinedIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Confirm Password"
              type={formData.showPassword ? 'text' : 'password'}
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={handleChange('acceptTerms')}
                  color="primary"
                />
              }
              label="I accept the terms and conditions"
            />
            {errors.acceptTerms && (
              <Typography color="error" variant="caption" display="block" sx={{ mt: 0.5 }}>
                {errors.acceptTerms}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleSignUp}
              startIcon={<PersonAddIcon />}
            >
              Sign Up
            </StyledButton>
          </Grid>

          <Grid item xs={12}>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ color: 'text.secondary' }}
            >
              Already have an account?{' '}
              <Button 
                onClick={onToggleLogin}
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
                Login
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          Account created successfully! Redirecting to login...
        </Alert>
      </Snackbar>
    </GradientBackground>
  );
}

export default SignUp;
