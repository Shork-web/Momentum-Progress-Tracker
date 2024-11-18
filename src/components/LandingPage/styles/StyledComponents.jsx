import { styled, keyframes } from '@mui/material/styles';
import { Typography, Button, Box } from '@mui/material';

// Animations
export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

export const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
export const HeroSection = styled(Box)(({ theme }) => ({
  background: '#0D47A1',
  minHeight: '80vh',
  color: theme.palette.common.white,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.1,
  }
}));

export const BrandName = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 800,
  letterSpacing: '-1px',
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(45deg, #FFFFFF 30%, #90CAF9 90%)',
  backgroundSize: '200% auto',
  animation: `${shine} 3s linear infinite`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textAlign: 'left',
  lineHeight: 1.2,
  position: 'relative',
  zIndex: 2,
  textShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  [theme.breakpoints.down('lg')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2.75rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
    letterSpacing: '-0.5px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '100px',
    height: '3px',
    background: 'linear-gradient(90deg, #2196F3, transparent)',
    borderRadius: '2px',
  }
}));

export const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
  transition: 'all 0.5s ease-in-out',
  animation: `${float} 6s ease-in-out infinite`,
  '&:hover': {
    transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg) translateY(-10px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
  }
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: '16px 40px',
  fontSize: '1.1rem',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #2196F3, #1565C0)',
  backgroundSize: '200% auto',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
  '&:hover': {
    backgroundPosition: 'right center',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
  }
}));

export const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.1)',
    '& .stat-number': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    }
  }
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  fontSize: { xs: '2.5rem', md: '3.5rem' },
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #90CAF9, #42A5F5)'
    : 'linear-gradient(45deg, #1976D2, #2196F3)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3, transparent)',
    borderRadius: '2px',
  }
}));

export const FloatingShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))',
  animation: `${float} 10s ease-in-out infinite`,
  zIndex: -1,
}));