import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Paper, 
  InputAdornment, Stack, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const ForgotPasswordCard = styled(Paper)(({ theme }) => ({
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

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      setIsSubmitting(false);
      return;
    }

    // Check if email exists in the system
    const users = StorageService.getUsers();
    const userExists = users.some(user => user.email === email);

    if (!userExists) {
      setError('No account found with this email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate sending reset email
    setTimeout(() => {
      setSuccessMessage('Password reset instructions have been sent to your email');
      setIsSubmitting(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    }, 1500);
  };

  return (
    <GradientBackground>
      <ForgotPasswordCard elevation={0}>
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
          Reset Password
        </Typography>

        <Stack spacing={3}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>

          <StyledTextField
            fullWidth
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {successMessage && (
            <Typography 
              color="success.main" 
              variant="body2" 
              align="center"
              sx={{ 
                py: 1,
                px: 2,
                bgcolor: 'success.light',
                borderRadius: 2,
                opacity: 0.8
              }}
            >
              {successMessage}
            </Typography>
          )}

          <GradientButton
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Reset Password'}
          </GradientButton>

          <Divider />

          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={onBackToLogin}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'transparent', 
                textDecoration: 'underline' 
              }
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </ForgotPasswordCard>
    </GradientBackground>
  );
}

export default ForgotPassword; 