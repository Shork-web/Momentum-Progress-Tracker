import React from 'react';
import { Typography, Button, Grid, Container, Stack, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { HeroSection, BrandName, PreviewImage, StyledButton } from '../styles/StyledComponents';
import preview from '../../../assets/preview.png';

const Hero = ({ onGetStarted }) => {
  return (
    <HeroSection>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid 
          container 
          spacing={4} 
          alignItems="center"
          sx={{ minHeight: '75vh' }}
        >
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              position: 'relative', 
              zIndex: 2,
              pr: { md: 4 }
            }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: 'primary.light',
                  letterSpacing: 4,
                  mb: 1,
                  display: 'block',
                  fontSize: '0.9rem'
                }}
              >
                WELCOME TO
              </Typography>
              <BrandName variant="h1" sx={{ 
                mb: 3,
                fontSize: { 
                  xs: '3.5rem',
                  sm: '4rem',
                  md: '4.5rem'
                },
                lineHeight: 1.2
              }}>
                MOMENTUM
              </BrandName>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2,
                  color: '#90CAF9',
                  fontWeight: 500,
                  fontSize: { 
                    xs: '1.5rem',
                    sm: '1.75rem',
                    md: '2rem'
                  }
                }}
              >
                Track Progress. Achieve More. Stay Focused.
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 6,
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                  maxWidth: '90%'
                }}
              >
                Transform your goals into achievable milestones with intuitive progress tracking, 
                real-time updates, and customizable task management tools.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3}
                sx={{ mb: 6 }}
              >
                <StyledButton
                  variant="contained"
                  onClick={onGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ minWidth: 200 }}
                >
                  Start Free Trial
                </StyledButton>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    padding: '16px 40px',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 200,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              {/* Trust Badges */}
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    mb: 2,
                    fontSize: '0.9rem'
                  }}
                >
                  Trusted by leading companies worldwide
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={4} 
                  alignItems="center"
                  sx={{
                    opacity: 0.7,
                    '& > *': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateY(-2px)'
                      }
                    }
                  }}
                >
                  {['Stark Industries', 'CIT-U', 'Umbrella Corp'].map((company, index) => (
                    <Typography 
                      key={index}
                      variant="body2"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        letterSpacing: 1
                      }}
                    >
                      {company}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Right Content - Preview Image */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ 
                position: 'relative',
                width: { xs: '100%', md: '140%' },
                right: { xs: 0, md: '-20%' },
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}>
                <PreviewImage 
                  src={preview} 
                  alt="Momentum Dashboard"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
};

export default Hero; 