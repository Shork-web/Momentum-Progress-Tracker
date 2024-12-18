import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Typography, Box, Grid, Paper, 
  InputAdornment, IconButton, FormControlLabel, Checkbox, 
  Stack, Divider, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  width: '100%',
  maxWidth: 450,
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

function Login({ onLogin, onToggleSignUp, setShowForgotPassword, setShowAuth }) {
  const [formState, setFormState] = useState({
    identifier: '',
    password: '',
    showPassword: false,
    errors: {},
    rememberMe: false,
    isSubmitting: false
  });

  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const remembered = await StorageService.getRememberedUser();
        if (remembered) {
          setFormState(prev => ({
            ...prev,
            identifier: remembered.credential,
            rememberMe: true
          }));
        }
      } catch (error) {
        console.error('Failed to load remembered user:', error);
      }
    };

    loadRememberedUser();
  }, []);

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

  const handleLogin = async () => {
    const { identifier, password, rememberMe } = formState;
    const errors = {};
    
    // Validation
    if (!identifier) {
      errors.identifier = 'Email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));

      // Try to find user by username first, then by email
      let user = await StorageService.getUser(identifier);
      if (!user) {
        user = await StorageService.getUserByEmail(identifier);
      }

      if (user && user.password === password) {
        if (rememberMe) {
          await StorageService.setRememberedUser(user.id, identifier);
        } else {
          await StorageService.setRememberedUser(null, null);
        }

        onLogin(user);
      } else {
        setFormState(prev => ({ 
          ...prev, 
          errors: { auth: 'User not found' },
          isSubmitting: false
        }));
      }
    } catch (error) {
      console.error('Login failed:', error);
      setFormState(prev => ({ 
        ...prev, 
        errors: { auth: 'Login failed. Please try again.' },
        isSubmitting: false
      }));
    }
  };

  return (
    <GradientBackground>
      <LoginCard elevation={0}>
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
          Login
        </Typography>

        <Stack spacing={3}>
          <StyledTextField
            fullWidth
            placeholder="Email is required"
            value={formState.identifier}
            onChange={handleInputChange('identifier')}
            error={!!formState.errors.identifier || !!formState.errors.auth}
            helperText={formState.errors.identifier || formState.errors.auth}
            disabled={formState.isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            type={formState.showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formState.password}
            onChange={handleInputChange('password')}
            error={!!formState.errors.password}
            helperText={formState.errors.password}
            disabled={formState.isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={togglePasswordVisibility} 
                    edge="end"
                    disabled={formState.isSubmitting}
                  >
                    {formState.showPassword ? 
                      <VisibilityOffOutlinedIcon /> : 
                      <VisibilityOutlinedIcon />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.rememberMe}
                  onChange={handleRememberMeChange}
                  color="primary"
                  size="small"
                  disabled={formState.isSubmitting}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Remember me
                </Typography>
              }
            />
            <Button 
              variant="text" 
              size="small"
              onClick={() => {
                setShowAuth(false);
                setShowForgotPassword(true);
              }}
              disabled={formState.isSubmitting}
              sx={{ 
                textTransform: 'none',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
              }}
            >
              Forgot password?
            </Button>
          </Box>

          <GradientButton
            fullWidth
            onClick={handleLogin}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </GradientButton>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Or Sign In Using
            </Typography>
          </Divider>

          <Stack direction="row" spacing={2}>
            <SocialButton 
              variant="outlined"
              disabled={formState.isSubmitting}
            >
              <FacebookIcon color="primary" />
            </SocialButton>
            <SocialButton 
              variant="outlined"
              disabled={formState.isSubmitting}
            >
              <TwitterIcon sx={{ color: '#1DA1F2' }} />
            </SocialButton>
            <SocialButton 
              variant="outlined"
              disabled={formState.isSubmitting}
            >
              <GoogleIcon sx={{ color: '#DB4437' }} />
            </SocialButton>
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button 
                onClick={onToggleSignUp}
                disabled={formState.isSubmitting}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Stack>
      </LoginCard>
    </GradientBackground>
  );
}

export default Login;
