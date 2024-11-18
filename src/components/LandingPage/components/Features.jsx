import React from 'react';
import { Typography, Grid, Container, Box } from '@mui/material';
import { SectionTitle } from '../styles/StyledComponents';

const Features = () => {
  const features = [
    {
      step: '01',
      title: 'Smart Task Management',
      description: 'Create, organize, and prioritize tasks with our intuitive interface. Set deadlines and track progress effortlessly.',
      icon: '📋'
    },
    {
      step: '02',
      title: 'Milestone Tracking',
      description: 'Break down large projects into achievable milestones. Monitor progress and celebrate small wins on your way to bigger goals.',
      icon: '🎯'
    },
    {
      step: '03',
      title: 'Progress Analytics',
      description: 'Visualize your productivity with detailed charts and graphs. Make data-driven decisions to optimize your workflow.',
      icon: '📊'
    },
    {
      step: '04',
      title: 'Smart Notifications',
      description: 'Stay on track with intelligent reminders and updates. Never miss important deadlines or project milestones.',
      icon: '🔔'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
          CORE FEATURES
        </Typography>
        <SectionTitle variant="h2">Powerful Yet Simple</SectionTitle>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}
        >
          Everything you need to stay productive and achieve your goals
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  borderColor: 'primary.main',
                  '& .feature-icon': {
                    transform: 'scale(1.2)',
                  }
                }
              }}
            >
              <Typography 
                className="feature-icon"
                variant="h4" 
                sx={{ 
                  fontSize: '3.5rem', 
                  mb: 3,
                  transition: 'transform 0.3s ease'
                }}
              >
                {item.icon}
              </Typography>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2
                }}
              >
                {item.title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.7,
                  fontSize: '1rem'
                }}
              >
                {item.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features; 