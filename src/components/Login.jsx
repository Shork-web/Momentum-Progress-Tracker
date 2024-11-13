import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Paper, InputAdornment, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EmailIcon from '@mui/icons-material/Email';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: 24,
  width: '100%',
  maxWidth: 450,
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.18)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  fontSize: '1.1rem',
  borderRadius: 12,
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

function Login({ onLogin, onToggleSignUp }) {
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' or 'email'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    setError('');
    
    if ((!username && loginMethod === 'username') || 
        (!email && loginMethod === 'email') || 
        !password) {
      setError('Please fill in all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => 
      (loginMethod === 'username' && u.username === username) ||
      (loginMethod === 'email' && u.email === email)
    );

    if (user && user.password === password) {
      const sanitizedUser = {
        username: user.username,
        email: user.email,
        id: user.id,
        fullName: user.fullName,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString()
      };

      // Update last login time and login count
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { 
              ...u, 
              lastLogin: new Date().toISOString(),
              loginCount: (u.loginCount || 0) + 1
            }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          loginMethod,
          credential: loginMethod === 'username' ? username : email
        }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      onLogin(sanitizedUser);
    } else {
      setError('Invalid credentials');
    }
  };

  // Load remembered user on component mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      const { loginMethod: savedMethod, credential } = JSON.parse(remembered);
      setLoginMethod(savedMethod);
      if (savedMethod === 'username') {
        setUsername(credential);
      } else {
        setEmail(credential);
      }
      setRememberMe(true);
    }
  }, []);

  return (
    <GradientBackground>
      <StyledPaper elevation={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              fontWeight="800"
              sx={{ 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 4
              }}
            >
              Welcome Back
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                onClick={() => setLoginMethod('username')}
                variant={loginMethod === 'username' ? 'contained' : 'outlined'}
                sx={{ mr: 1 }}
              >
                Username
              </Button>
              <Button
                onClick={() => setLoginMethod('email')}
                variant={loginMethod === 'email' ? 'contained' : 'outlined'}
              >
                Email
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {loginMethod === 'username' ? (
              <StyledTextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <StyledTextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography 
                color="error" 
                variant="body2" 
                align="center"
                sx={{ 
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  padding: 1,
                  borderRadius: 1,
                  width: '100%'
                }}
              >
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={handleLogin}
              startIcon={<LoginIcon />}
            >
              Login
            </StyledButton>
          </Grid>
          <Grid item xs={12}>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: 'text.secondary',
                mt: 2
              }}
            >
              Don't have an account?{' '}
              <Button 
                onClick={onToggleSignUp}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2C3E50, #3498DB)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </GradientBackground>
  );
}

export default Login;
