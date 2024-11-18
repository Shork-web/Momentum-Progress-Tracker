import React from 'react';
import { Typography, Button, Grid, Container, Box, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { SectionTitle } from '../styles/StyledComponents';

const Pricing = ({ onGetStarted }) => {
  const plans = [
    {
      title: 'Free',
      price: '$0',
      features: [
        'Basic Progress Tracking',
        'Up to 3 Projects',
        'Email Support',
        'Basic Analytics',
        'Task Management',
        'Mobile App Access'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      popular: false
    },
    {
      title: 'Pro',
      price: '$12',
      period: '/month',
      features: [
        'Unlimited Projects',
        'Advanced Analytics',
        'Priority Support',
        'Team Collaboration',
        'Custom Dashboards',
        'API Access',
        'Advanced Reporting',
        'Goal Setting Tools'
      ],
      buttonText: 'Try Pro Free',
      buttonVariant: 'contained',
      popular: true
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      features: [
        'Custom Solutions',
        'Dedicated Support',
        'SLA Guarantee',
        'Advanced Security',
        'Custom Integration',
        'Training Sessions',
        'Custom Features',
        'Unlimited Users'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outlined',
      popular: false
    }
  ];

  return (
    <Box sx={{ py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
            PRICING PLANS
          </Typography>
          <SectionTitle variant="h2">Simple, Transparent Pricing</SectionTitle>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}
          >
            Choose the perfect plan for your needs. No hidden fees.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: plan.popular ? 2 : 1,
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {plan.popular && (
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    Most Popular
                  </Typography>
                )}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {plan.title}
                </Typography>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                  {plan.price}
                  {plan.period && (
                    <Typography 
                      component="span" 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: '1rem' }}
                    >
                      {plan.period}
                    </Typography>
                  )}
                </Typography>
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {plan.features.map((feature, idx) => (
                    <Typography 
                      key={idx} 
                      variant="body2" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'text.secondary'
                      }}
                    >
                      <CheckIcon color="primary" sx={{ fontSize: '1.2rem' }} /> 
                      {feature}
                    </Typography>
                  ))}
                </Stack>
                <Button
                  variant={plan.buttonVariant}
                  fullWidth
                  onClick={onGetStarted}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    ...(plan.buttonVariant === 'contained' && {
                      background: 'linear-gradient(45deg, #2196F3, #1565C0)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #0D47A1)',
                        boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                      }
                    }),
                    ...(plan.buttonVariant === 'outlined' && {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                      }
                    })
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing; 