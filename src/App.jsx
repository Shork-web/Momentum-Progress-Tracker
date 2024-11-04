import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  AppBar, 
  Toolbar, 
  IconButton, 
  useMediaQuery, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TaskList from './components/TaskList';
import MilestoneTracker from './components/MilestoneTracker';
import NotificationCenter from './components/NotificationCenter';
import Dashboard from './components/Dashboard';
import TabPanel, { StyledTabs, a11yProps } from './components/TabPanel';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/Signup';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

function App() {
  const [tasks, setTasks] = useState(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const savedTasks = localStorage.getItem(`tasks_${JSON.parse(currentUser).username}`);
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  const [milestones, setMilestones] = useState(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const savedMilestones = localStorage.getItem(`milestones_${JSON.parse(currentUser).username}`);
      return savedMilestones ? JSON.parse(savedMilestones) : [];
    }
    return [];
  });

  const [notifications, setNotifications] = useState([]);
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('currentTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
  const [mode, setMode] = useState('light');
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

  const addNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleLogin = (user) => {
    const savedTasks = localStorage.getItem(`tasks_${user.username}`);
    const savedMilestones = localStorage.getItem(`milestones_${user.username}`);
    
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    setMilestones(savedMilestones ? JSON.parse(savedMilestones) : []);
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(tasks));
      localStorage.setItem(`milestones_${currentUser.username}`, JSON.stringify(milestones));
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentTab');
    
    setCurrentUser(null);
    setTasks([]);
    setMilestones([]);
    setShowAuth(true);
    setLogoutDialogOpen(false);
  };

  const handleSignUp = () => {
    setShowSignUp(false);
  };

  const handleToggleSignUp = () => {
    setShowSignUp(true);
  };

  const handleToggleLogin = () => {
    setShowSignUp(false);
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
    };
    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);

    const newMilestones = newTask.milestones;
    const updatedMilestones = [...milestones, ...newMilestones.map(milestone => ({
      ...milestone,
      id: Date.now(),
    }))];
    setMilestones(updatedMilestones);

    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(updatedTasks));
      localStorage.setItem(`milestones_${currentUser.username}`, JSON.stringify(updatedMilestones));
    }
    addNotification('New task added successfully!');
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(updatedTasks));
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(updatedTasks));
    }
    addNotification('Task deleted successfully!');
  };

  const handleMilestoneUpdate = (updatedMilestones) => {
    setMilestones(updatedMilestones);
    if (currentUser) {
      localStorage.setItem(`milestones_${currentUser.username}`, JSON.stringify(updatedMilestones));
    }
  };

  useEffect(() => {
    localStorage.setItem('currentTab', tabValue.toString());
  }, [tabValue]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

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
        {showSignUp ? (
          <SignUp onSignUp={handleSignUp} onToggleLogin={handleToggleLogin} />
        ) : (
          <Login onLogin={handleLogin} onToggleSignUp={handleToggleSignUp} />
        )}
      </ThemeProvider>
    );
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingPage onGetStarted={handleGetStarted} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'linear-gradient(to right, #1976d2, #1e88e5)'
          }}
        >
          <Toolbar 
            variant="dense" 
            sx={{ 
              minHeight: '48px',
              px: { xs: 2, sm: 3 }
            }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              Progress Tracker
            </Typography>
            <IconButton 
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }} 
              onClick={toggleColorMode} 
              color="inherit" 
              size="small"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button 
              color="inherit" 
              onClick={openLogoutDialog}
              size="small"
              sx={{
                ml: 1,
                fontSize: '0.875rem',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '6px',
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Toolbar>
          <Box sx={{ px: { xs: 2, sm: 3 } }}>
            <StyledTabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="app navigation tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab 
                label="Dashboard" 
                icon={<DashboardOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab 
                label="Tasks" 
                icon={<AssignmentOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
                {...a11yProps(1)}
              />
              <Tab 
                label="Milestones" 
                icon={<FlagOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
                {...a11yProps(2)}
              />
            </StyledTabs>
          </Box>
        </AppBar>
        <NotificationCenter notifications={notifications} setNotifications={setNotifications} />
        <Box sx={{ flexGrow: 1, overflow: 'auto', width: '100%' }}>
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

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
