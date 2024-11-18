import React from 'react';
import { Box, useTheme } from '@mui/material';
import Hero from './components/Hero';
import Features from './components/Features';
import Statistics from './components/Statistics';
import Pricing from './components/Pricing';
import CTA from './components/CTA';

function LandingPage({ onGetStarted }) {
  const theme = useTheme();

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      overflow: 'auto',
      height: '100%',
      scrollBehavior: 'smooth'
    }}>
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <Statistics />
      <Pricing onGetStarted={onGetStarted} />
      <CTA onGetStarted={onGetStarted} />
    </Box>
  );
}

export default LandingPage; 