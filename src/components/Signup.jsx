import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Grid, Paper, 
  InputAdornment, IconButton, FormControlLabel, Checkbox,
  Stack, Divider, Snackbar, Alert
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
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';

// Services
import StorageService from '../services/storage';

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

const SignUpCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  width: '100%',
  maxWidth: 500,
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    }
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
  borderRadius: 50,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 2px rgba(33, 150, 243, .3)',
  }
}));

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  padding: '8px 15px',
  flex: 1,
  borderColor: 'rgba(0, 0, 0, 0.12)',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  }
}));

function SignUp({ onSignUp, onToggleLogin }) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false,
    showPassword: false,
    isSubmitting: false,
    errors: {}
  });

  const handleChange = (field) => (event) => {
    setFormState(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSignUp = async () => {
    const newErrors = {};
    
    // Validation
    if (!formState.username) {
      newErrors.username = 'Username is required';
    } else if (formState.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])/.test(formState.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formState.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formState.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: newErrors }));
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));

      // Check if username exists
      const existingUsername = await StorageService.checkUserExists(formState.username);
      if (existingUsername) {
        setFormState(prev => ({ 
          ...prev, 
          errors: { ...prev.errors, username: 'Username already exists' },
          isSubmitting: false
        }));
        return;
      }

      // Check if email exists
      const existingEmail = await StorageService.getUserByEmail(formState.email);
      if (existingEmail) {
        setFormState(prev => ({ 
          ...prev, 
          errors: { ...prev.errors, email: 'Email already exists' },
          isSubmitting: false
        }));
        return;
      }

      // Create new user
      const newUser = {
        username: formState.username,
        email: formState.email,
        password: formState.password,
        fullName: formState.fullName,
        createdAt: new Date().toISOString()
      };

      await StorageService.setUser(newUser);
      
      // Show success message and redirect
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        showSuccessMessage: true 
      }));
      
      setTimeout(() => {
        onSignUp();
      }, 2000);

    } catch (error) {
      console.error('Sign up failed:', error);
      setFormState(prev => ({ 
        ...prev, 
        errors: { ...prev.errors, submit: 'Failed to create account. Please try again.' },
        isSubmitting: false
      }));
    }
  };

  return (
    <GradientBackground>
      <SignUpCard elevation={0}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 4,
            color: 'text.primary'
          }}
        >
          Create Account
        </Typography>

        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                placeholder="Full Name"
                value={formState.fullName}
                onChange={handleChange('fullName')}
                error={!!formState.errors.fullName}
                helperText={formState.errors.fullName}
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
                fullWidth
                placeholder="Username"
                value={formState.username}
                onChange={handleChange('username')}
                error={!!formState.errors.username}
                helperText={formState.errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <StyledTextField
            fullWidth
            placeholder="Email"
            type="email"
            value={formState.email}
            onChange={handleChange('email')}
            error={!!formState.errors.email}
            helperText={formState.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type={formState.showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formState.password}
                onChange={handleChange('password')}
                error={!!formState.errors.password}
                helperText={formState.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
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
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type={formState.showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formState.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={!!formState.errors.confirmPassword}
                helperText={formState.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={formState.acceptTerms}
                onChange={handleChange('acceptTerms')}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I accept the terms and conditions
              </Typography>
            }
          />
          {formState.errors.acceptTerms && (
            <Typography color="error" variant="caption">
              {formState.errors.acceptTerms}
            </Typography>
          )}

          <GradientButton
            fullWidth
            onClick={handleSignUp}
            startIcon={<PersonAddIcon />}
            disabled={formState.isSubmitting}
          >
            Sign Up
          </GradientButton>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Or Sign Up Using
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2}>
            <SocialButton variant="outlined">
              <FacebookIcon color="primary" />
            </SocialButton>
            <SocialButton variant="outlined">
              <TwitterIcon sx={{ color: '#1DA1F2' }} />
            </SocialButton>
            <SocialButton variant="outlined">
              <GoogleIcon sx={{ color: '#DB4437' }} />
            </SocialButton>
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button 
                onClick={onToggleLogin}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Stack>
      </SignUpCard>

      <Snackbar
        open={formState.showSuccessMessage}
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
