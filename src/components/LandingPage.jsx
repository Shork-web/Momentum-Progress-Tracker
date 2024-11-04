import React from 'react';
import { Typography, Button, Box, Grid, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import preview from '../assets/preview.png';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(-45deg, 
    #007bff,
    #6610f2,
    #6f42c1,
    #e83e8c,
    #20c997,
    #17a2b8)`,
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`, 
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.common.white,
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '1.2rem',
  fontWeight: 'bold',
  borderRadius: '30px',
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: 'rgba(255, 255, 255, 0.9)',
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
});

function LandingPage({ onGetStarted }) {
  const theme = useTheme();

  return (
    <GradientBackground>
      <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '3rem', md: '4rem', lg: '5rem' } }}>
            Welcome to Task Tracker
          </Typography>
          <Typography variant="h4" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Streamline your workflow, boost productivity, and achieve your goals with our powerful task management tool.
          </Typography>
          <StyledButton
            variant="contained"
            size="large"
            onClick={onGetStarted}
            startIcon={<TaskAltIcon />}
          >
            Get Started
          </StyledButton>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <PreviewImage src={preview} alt="Task Tracker Preview" />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} sx={{ p: 4 }}>
            <Grid item xs={12} md={4}>
              <FeatureBox>
                <IconWrapper>
                  <AssignmentIcon fontSize="inherit" />
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  Effortless Task Management
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Create, organize, and prioritize tasks with ease. Stay on top of your to-do list and never miss a deadline.
                </Typography>
              </FeatureBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureBox>
                <IconWrapper>
                  <TimelineIcon fontSize="inherit" />
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  Milestone Tracking
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Set and track milestones for your projects. Celebrate your progress and stay motivated throughout your journey.
                </Typography>
              </FeatureBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureBox>
                <IconWrapper>
                  <TrendingUpIcon fontSize="inherit" />
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  Insightful Analytics
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Gain valuable insights into your productivity with our comprehensive dashboard and progress reports.
                </Typography>
              </FeatureBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </GradientBackground>
  );
}

export default LandingPage;
