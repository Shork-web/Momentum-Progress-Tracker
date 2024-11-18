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
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
    if (Object.keys(newErrors).length === 0) {
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
        onToggleLogin();
      }, 2000);
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
                fullWidth
                placeholder="Username"
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
          </Grid>

          <StyledTextField
            fullWidth
            placeholder="Email"
            type="email"
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

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Password"
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
                fullWidth
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
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
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptTerms}
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
          {errors.acceptTerms && (
            <Typography color="error" variant="caption">
              {errors.acceptTerms}
            </Typography>
          )}

          <GradientButton
            fullWidth
            onClick={handleSignUp}
            startIcon={<PersonAddIcon />}
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
