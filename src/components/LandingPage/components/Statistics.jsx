import React from 'react';
import { Typography, Grid, Container, Box } from '@mui/material';
import { StatCard } from '../styles/StyledComponents';

const Statistics = () => {
  const stats = [
    { 
      value: '98%', 
      label: 'User Satisfaction', 
      icon: '😊',
      description: 'Of our users report improved productivity'
    },
    { 
      value: '50K+', 
      label: 'Active Users', 
      icon: '👥',
      description: 'Professionals using Momentum daily'
    },
    { 
      value: '1M+', 
      label: 'Tasks Completed', 
      icon: '✅',
      description: 'Milestones achieved through our platform'
    },
    { 
      value: '24/7', 
      label: 'Support Available', 
      icon: '🛟',
      description: 'Round-the-clock expert assistance'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
            BY THE NUMBERS
          </Typography>
          <Typography variant="h2" sx={{ 
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3, #1565C0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Trusted by Thousands
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Join our growing community of productive professionals
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                  {stat.icon}
                </Typography>
                <Typography 
                  variant="h3" 
                  className="stat-number"
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3, #1565C0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Statistics; 