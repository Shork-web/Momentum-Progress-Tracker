import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, Typography, Tab, AppBar, Toolbar, IconButton, 
  useMediaQuery, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
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
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/Signup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Router
import { useNavigate, useLocation } from 'react-router-dom';
import StorageService from './services/storage';

function App() {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme and media query
  const [mode, setMode] = useState(() => {
    const currentUser = StorageService.getUser();
    return currentUser ? StorageService.getUserTheme(currentUser.username) : 'light';
  });
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // State management
  const [notifications, setNotifications] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // User and data management
  const [currentUser, setCurrentUser] = useState(() => StorageService.getUser());

  const [tasks, setTasks] = useState(() => {
    if (currentUser) {
      return StorageService.getTasks(currentUser.username);
    }
    return [];
  });

  const [milestones, setMilestones] = useState(() => {
    if (currentUser) {
      return StorageService.getMilestones(currentUser.username);
    }
    return [];
  });

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

  // Notification handlers
  const addNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

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
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (currentUser) {
        StorageService.setUserTheme(currentUser.username, newMode);
      }
      return newMode;
    });
  };

  // Authentication handlers
  const handleGetStarted = () => {
    setShowAuth(true);
    navigate('/login');
  };

  const handleLogin = (user) => {
    const tasks = StorageService.getTasks(user.username);
    const milestones = StorageService.getMilestones(user.username);
    
    setTasks(tasks);
    setMilestones(milestones);
    setCurrentUser(user);
    setShowAuth(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    if (currentUser) {
      StorageService.setTasks(currentUser.username, tasks);
      StorageService.setMilestones(currentUser.username, milestones);
      StorageService.clearUserData(currentUser.username);
    }
    
    setMode('light');
    
    setCurrentUser(null);
    setTasks([]);
    setMilestones([]);
    setShowAuth(true);
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const handleSignUp = () => {
    setShowSignUp(false);
  };

  // Task handlers
  const handleAddTask = (newTask) => {
    if (newTask.id) {
      // If task has ID, it's an update
      const updatedTasks = tasks.map(task => 
        task.id === newTask.id ? newTask : task
      );
      setTasks(updatedTasks);

      // Update milestones
      const oldTask = tasks.find(task => task.id === newTask.id);
      const oldMilestones = oldTask?.milestones || [];
      const newMilestones = newTask.milestones;

      // Remove old milestones associated with this task
      const filteredMilestones = milestones.filter(milestone => 
        !oldMilestones.some(oldM => oldM.id === milestone.id)
      );

      // Add updated milestones
      const updatedMilestones = [
        ...filteredMilestones,
        ...newMilestones.map(milestone => ({
          ...milestone,
          id: milestone.id || Date.now() + Math.random(),
          taskId: newTask.id
        }))
      ];

      setMilestones(updatedMilestones);

      if (currentUser) {
        StorageService.setTasks(currentUser.username, updatedTasks);
        StorageService.setMilestones(currentUser.username, updatedMilestones);
      }
      addNotification('Task updated successfully!');
    } else {
      // New task
      const taskWithId = {
        ...newTask,
        id: Date.now(),
      };
      const updatedTasks = [...tasks, taskWithId];
      setTasks(updatedTasks);

      // Add new milestones
      const newMilestones = newTask.milestones;
      const updatedMilestones = [
        ...milestones,
        ...newMilestones.map(milestone => ({
          ...milestone,
          id: Date.now() + Math.random(),
          taskId: taskWithId.id
        }))
      ];
      setMilestones(updatedMilestones);

      if (currentUser) {
        StorageService.setTasks(currentUser.username, updatedTasks);
        StorageService.setMilestones(currentUser.username, updatedMilestones);
      }
      addNotification('New task added successfully!');
    }
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (currentUser) {
      StorageService.setTasks(currentUser.username, updatedTasks);
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    if (currentUser) {
      StorageService.setTasks(currentUser.username, updatedTasks);
    }
    addNotification('Task deleted successfully!');
  };

  // Milestone handlers
  const handleMilestoneUpdate = (updatedMilestones) => {
    setMilestones(updatedMilestones);
    if (currentUser) {
      StorageService.setMilestones(currentUser.username, updatedMilestones);
    }
  };

  // Effects
  useEffect(() => {
    const pathToIndex = {
      '/dashboard': 0,
      '/tasks': 1,
      '/milestones': 2,
      '/': 0
    };
    setTabValue(pathToIndex[location.pathname] || 0);
  }, [location.pathname]);

  useEffect(() => {
    if (currentUser) {
      StorageService.setUser(currentUser);
    } else {
      StorageService.setUser(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      if (location.pathname === '/login' || location.pathname === '/signup') {
        setShowAuth(true);
      } else if (location.pathname !== '/') {
        navigate('/');
      }
    } else {
      if (['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/dashboard');
      }
    }
  }, [currentUser, location.pathname, navigate]);

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
  if (!currentUser && !showAuth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingPage onGetStarted={handleGetStarted} />
      </ThemeProvider>
    );
  }

  if (showAuth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {location.pathname === '/signup' ? (
          <SignUp onSignUp={handleSignUp} onToggleLogin={() => navigate('/login')} />
        ) : (
          <Login onLogin={handleLogin} onToggleSignUp={() => navigate('/signup')} />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          width: '100%',
        }}
      >
        {renderAppBar()}
        <NotificationCenter notifications={notifications} setNotifications={setNotifications} />
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
            <Dashboard tasks={tasks} milestones={milestones} />
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
              addNotification={addNotification}
            />
          </TabPanel>
        </Box>
      </Box>
      {renderLogoutDialog()}
    </ThemeProvider>
  );
}

export default App;
