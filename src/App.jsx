import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, Typography, Tab, AppBar, Toolbar, IconButton, 
  useMediaQuery, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, CircularProgress 
} from '@mui/material';

// Icons
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

// Components
import TaskList from './components/TaskList';
import MilestoneTracker from './components/MilestoneTracker';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './components/Dashboard';
import TabPanel, { StyledTabs, a11yProps } from './components/TabPanel';
import LandingPage from './components/LandingPage/Landingpage';
import Login from './components/Login';
import SignUp from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

// Router
import { useNavigate, useLocation } from 'react-router-dom';
import StorageService from './services/storage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme and media query
  const [mode, setMode] = useState('light');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // State management
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // User and data management
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // Tab management
  const [tabValue, setTabValue] = useState(() => {
    const pathToIndex = {
      '/dashboard': 0,
      '/tasks': 1,
      '/milestones': 2,
      '/': 0
    };
    return pathToIndex[location.pathname] || 0;
  });

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#303030' : '#f5f5f5',
        paper: mode === 'dark' ? '#424242' : '#fff',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#212121' : '#1976d2',
          },
        },
      },
    },
  });

  // Navigation handlers
  const handleTabChange = (event, newValue) => {
    const indexToPath = {
      0: '/dashboard',
      1: '/tasks',
      2: '/milestones'
    };
    setTabValue(newValue);
    navigate(indexToPath[newValue]);
  };

  // Theme handlers
  const toggleColorMode = async () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      if (currentUser) {
        await StorageService.setUserTheme(currentUser.id, newMode);
      }
      setMode(newMode);
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  };

  // Authentication handlers
  const handleGetStarted = () => {
    setShowAuth(true);
    navigate('/login');
  };

  const handleLogin = async (user) => {
    try {
      await StorageService.updateUserLoginInfo(user.id);
      
      // Load user data
      const [userTasks, userMilestones, userTheme] = await Promise.all([
        StorageService.getTasks(user.id),
        StorageService.getMilestones(user.id),
        StorageService.getUserTheme(user.id)
      ]);
      
      // Set all state at once
      setCurrentUser(user);
      setTasks(userTasks || []);
      setMilestones(userMilestones || []);
      setMode(userTheme || 'light');
      setShowAuth(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      // Only clear the remembered user credentials
      await StorageService.setUser(null);
      
      // Clear user state but don't clear data
      setCurrentUser(null);
      setMode('light');
      
      // Close dialog and redirect
      setLogoutDialogOpen(false);
      setShowAuth(true);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSignUp = () => {
    setShowSignUp(false);
    navigate('/login');
  };

  // Task handlers
  const handleAddTask = async (newTask) => {
    try {
      if (!currentUser) return;

      if (newTask.id) {
        // Update existing task
        await StorageService.updateTask(newTask.id, newTask);
        
        // Update tasks state without replacing the entire array
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === newTask.id ? newTask : task)
        );

        // Handle new milestones only
        if (newTask.milestones?.length > 0) {
          const newMilestones = newTask.milestones.filter(m => !m.id);
          
          if (newMilestones.length > 0) {
            const createdMilestones = await Promise.all(
              newMilestones.map(async milestone => {
                const id = await StorageService.createMilestone(currentUser.id, {
                  ...milestone,
                  taskId: newTask.id
                });
                return { ...milestone, id, taskId: newTask.id };
              })
            );

            // Append only new milestones to existing ones
            setMilestones(prevMilestones => [...prevMilestones, ...createdMilestones]);
          }
        }
      } else {
        // Create new task
        const taskId = await StorageService.createTask(currentUser.id, newTask);
        const taskWithId = { ...newTask, id: taskId };
        
        // Add new task to state
        setTasks(prevTasks => [...prevTasks, taskWithId]);

        // Handle milestones for new task
        if (newTask.milestones?.length > 0) {
          const createdMilestones = await Promise.all(
            newTask.milestones.map(async milestone => {
              const id = await StorageService.createMilestone(currentUser.id, {
                ...milestone,
                taskId
              });
              return { ...milestone, id, taskId };
            })
          );

          setMilestones(prevMilestones => [...prevMilestones, ...createdMilestones]);
        }
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { 
        ...taskToUpdate, 
        completed: !taskToUpdate.completed 
      };

      await StorageService.updateTask(taskId, updatedTask);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log('Deleting task:', taskId);
      
      // Delete from database
      await StorageService.deleteTask(taskId);
      
      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      console.log('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  // Milestone handlers
  const handleMilestoneUpdate = async (updatedMilestones) => {
    try {
      if (!currentUser) return;
      
      // Update local state
      setMilestones(updatedMilestones);
      
      // Update in database
      await StorageService.setMilestones(currentUser.id, updatedMilestones);
      
    } catch (error) {
      console.error('Failed to update milestones:', error);
    }
  };

  // Effects
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const user = await StorageService.getUser();
        
        if (user) {
          const [userTasks, userMilestones, userTheme] = await Promise.all([
            StorageService.getTasks(user.id),
            StorageService.getMilestones(user.id),
            StorageService.getUserTheme(user.id)
          ]);
          
          setCurrentUser(user);
          setTasks(userTasks || []);
          setMilestones(userMilestones || []);
          setMode(userTheme || 'light');

          // Set the correct tab value based on current path
          const pathToIndex = {
            '/dashboard': 0,
            '/tasks': 1,
            '/milestones': 2
          };
          setTabValue(pathToIndex[location.pathname] || 0);

          // Don't redirect if already on a valid route
          if (location.pathname === '/') {
            navigate('/dashboard');
          }
        } else {
          // Only redirect to landing page if not on auth routes
          if (!['/login', '/signup'].includes(location.pathname)) {
            navigate('/');
          }
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to load application data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (!isLoading && !currentUser) {
      if (!['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/');
      }
    }
  }, [currentUser, isLoading]);

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const user = await StorageService.getUser();
        
        if (user) {
          const [userTasks, userMilestones, userTheme] = await Promise.all([
            StorageService.getTasks(user.id),
            StorageService.getMilestones(user.id),
            StorageService.getUserTheme(user.id)
          ]);
          
          setCurrentUser(user);
          setTasks(userTasks || []);
          setMilestones(userMilestones || []);
          setMode(userTheme || 'light');

          if (location.pathname === '/') {
            navigate('/dashboard');
          }
        } else {
          if (!['/login', '/signup'].includes(location.pathname)) {
            navigate('/');
          }
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to load application data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Render methods
  const renderLogoutDialog = () => (
    <Dialog
      open={logoutDialogOpen}
      onClose={() => setLogoutDialogOpen(false)}
      aria-labelledby="logout-dialog-title"
    >
      <DialogTitle id="logout-dialog-title">{"Confirm Logout"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="primary" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderAppBar = () => (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'linear-gradient(to right, #1976d2, #1e88e5)',
        flexShrink: 0,
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{ 
          minHeight: { xs: '56px', sm: '48px' },
          px: { xs: 1, sm: 2, md: 3 },
          gap: 1
        }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Momentum
        </Typography>
        <IconButton 
          sx={{ ml: { xs: 0, sm: 1 } }} 
          onClick={toggleColorMode} 
          color="inherit" 
          size="small"
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button 
          color="inherit" 
          onClick={() => setLogoutDialogOpen(true)} 
          size="small"
          sx={{
            minWidth: { xs: 'auto', sm: '64px' },
            px: { xs: 1, sm: 2 },
            whiteSpace: 'nowrap'
          }}
        >
          Logout
        </Button>
      </Toolbar>
      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        overflow: 'auto'
      }}>
        <StyledTabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: '48px', sm: '40px' },
            '& .MuiTab-root': {
              minHeight: { xs: '48px', sm: '40px' },
              px: { xs: 1, sm: 2 },
              minWidth: { xs: 'auto', sm: '120px' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }
          }}
        >
          <Tab 
            label="Dashboard" 
            icon={<DashboardOutlinedIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab 
            label="Tasks" 
            icon={<AssignmentOutlinedIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab 
            label="Milestones" 
            icon={<FlagOutlinedIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />}
            iconPosition="start"
            {...a11yProps(2)}
          />
        </StyledTabs>
      </Box>
    </AppBar>
  );

  // Main render
  if (!currentUser && !showAuth && !showForgotPassword && location.pathname === '/') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider value={{ currentUser }}>
            <LandingPage onGetStarted={handleGetStarted} />
            <NotificationCenter />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    );
  }

  if (showAuth || showForgotPassword) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider value={{ currentUser }}>
            {showForgotPassword ? (
              <ForgotPassword 
                onBackToLogin={() => {
                  setShowForgotPassword(false);
                  setShowAuth(true);
                }} 
              />
            ) : (
              <>
                {location.pathname === '/signup' ? (
                  <SignUp 
                    onSignUp={handleSignUp} 
                    onToggleLogin={() => navigate('/login')} 
                  />
                ) : (
                  <Login 
                    onLogin={handleLogin} 
                    onToggleSignUp={() => navigate('/signup')}
                    setShowForgotPassword={setShowForgotPassword}
                    setShowAuth={setShowAuth}
                  />
                )}
              </>
            )}
            <NotificationCenter />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider value={{ currentUser }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh',
            width: '100%',
          }}>
            {renderAppBar()}
            <NotificationCenter />
            <Box 
              sx={{ 
                flexGrow: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 104px)', // Adjust this value based on your AppBar height
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <Dashboard 
                  tasks={tasks} 
                  milestones={milestones} 
                  currentUser={currentUser} 
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TaskList 
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                  milestones={milestones}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <MilestoneTracker 
                  milestones={milestones} 
                  setMilestones={handleMilestoneUpdate}
                  tasks={tasks}
                />
              </TabPanel>
            </Box>
          </Box>
        </AuthProvider>
      </NotificationProvider>
      {renderLogoutDialog()}
    </ThemeProvider>
  );
}

export default App;
