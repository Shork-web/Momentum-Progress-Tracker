import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Paper, 
  InputAdornment, Stack, Divider, CircularProgress
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
  const [formState, setFormState] = useState({
    email: '',
    error: '',
    successMessage: '',
    isSubmitting: false
  });

  const handleSubmit = async () => {
    setFormState(prev => ({ 
      ...prev, 
      error: '',
      successMessage: '',
      isSubmitting: true 
    }));

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Email is required',
        isSubmitting: false 
      }));
      return;
    }
    if (!emailRegex.test(formState.email)) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Invalid email format',
        isSubmitting: false 
      }));
      return;
    }

    try {
      // Check if email exists in the system
      const user = await StorageService.getUserByEmail(formState.email);
      
      if (!user) {
        setFormState(prev => ({ 
          ...prev, 
          error: 'No account found with this email address',
          isSubmitting: false 
        }));
        return;
      }

      // Simulate sending reset email
      setTimeout(() => {
        setFormState(prev => ({ 
          ...prev,
          successMessage: 'Password reset instructions have been sent to your email',
          isSubmitting: false 
        }));
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 3000);
      }, 1500);

    } catch (error) {
      console.error('Password reset failed:', error);
      setFormState(prev => ({ 
        ...prev, 
        error: 'Failed to process request. Please try again.',
        isSubmitting: false 
      }));
    }
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
            value={formState.email}
            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
            error={!!formState.error}
            helperText={formState.error}
            disabled={formState.isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {formState.successMessage && (
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
              {formState.successMessage}
            </Typography>
          )}

          <GradientButton
            fullWidth
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </GradientButton>

          <Divider />

          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={onBackToLogin}
            disabled={formState.isSubmitting}
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