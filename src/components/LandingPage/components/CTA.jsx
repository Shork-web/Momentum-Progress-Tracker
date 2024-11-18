import React from 'react';
import { Typography, Button, Container, Box, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StyledButton, FloatingShape } from '../styles/StyledComponents';

const CTA = ({ onGetStarted }) => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper',
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="md">
        <Box 
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            py: 4
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(45deg, #2196F3, #1565C0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Ready to Transform Your Productivity?
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              mb: 4, 
              maxWidth: '600px', 
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Join thousands of successful professionals who use Momentum to achieve their goals.
            Start your journey today!
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <StyledButton
              variant="contained"
              onClick={onGetStarted}
              endIcon={<ArrowForwardIcon />}
              size="large"
              sx={{
                minWidth: 200,
                py: 2
              }}
            >
              Start Free Trial
            </StyledButton>
            <Button
              variant="outlined"
              size="large"
              sx={{
                minWidth: 200,
                py: 2,
                borderRadius: '50px',
                borderWidth: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                }
              }}
            >
              Schedule Demo
            </Button>
          </Stack>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 4, 
              color: 'text.secondary',
              opacity: 0.8
            }}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </Typography>
        </Box>
      </Container>

      {/* Decorative floating shapes */}
      <FloatingShape 
        sx={{ 
          width: '400px',
          height: '400px',
          top: '-20%',
          right: '-10%',
          opacity: 0.1,
          background: 'linear-gradient(45deg, #2196F3, #1565C0)'
        }} 
      />
      <FloatingShape 
        sx={{ 
          width: '300px',
          height: '300px',
          bottom: '-10%',
          left: '-5%',
          opacity: 0.1,
          background: 'linear-gradient(45deg, #1565C0, #2196F3)'
        }} 
      />
      
      {/* Additional small decorative shapes */}
      <FloatingShape 
        sx={{ 
          width: '100px',
          height: '100px',
          top: '20%',
          left: '10%',
          opacity: 0.05,
          background: 'linear-gradient(45deg, #90CAF9, #42A5F5)'
        }} 
      />
      <FloatingShape 
        sx={{ 
          width: '150px',
          height: '150px',
          bottom: '30%',
          right: '15%',
          opacity: 0.05,
          background: 'linear-gradient(45deg, #42A5F5, #90CAF9)'
        }} 
      />
    </Box>
  );
};

export default CTA; 