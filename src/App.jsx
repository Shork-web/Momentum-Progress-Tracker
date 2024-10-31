import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Typography, Tabs, Tab, AppBar, Toolbar, IconButton, useMediaQuery, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TaskList from './components/TaskList'
import MilestoneTracker from './components/MilestoneTracker'
import NotificationCenter from './components/NotificationCenter'
import Dashboard from './components/Dashboard'
import TabPanel from './components/TabPanel'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import SignUp from './components/Signup'
import TaskForm from './components/TaskForm'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'transparent',
  minHeight: '40px',
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: '#fff',
  },
  '& .MuiTab-root': {
    minHeight: '40px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.3px',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    '&.Mui-selected': {
      color: '#fff',
      fontWeight: 600,
    },
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
  },
}));

function App() {
  const [tasks, setTasks] = useState([])
  const [milestones, setMilestones] = useState([])
  const [notifications, setNotifications] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [mode, setMode] = useState('light')
  const [currentUser, setCurrentUser] = useState(null)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false) // New state for logout dialog
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

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
  })

  useEffect(() => {
    if (currentUser) {
      const savedTasks = localStorage.getItem(`tasks_${currentUser.username}`)
      setTasks(savedTasks ? JSON.parse(savedTasks) : [])
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      const savedMilestones = localStorage.getItem(`milestones_${currentUser.username}`)
      setMilestones(savedMilestones ? JSON.parse(savedMilestones) : [])
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(tasks))
    }
  }, [tasks, currentUser])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`milestones_${currentUser.username}`, JSON.stringify(milestones))
    }
  }, [milestones, currentUser])

  const addNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }])
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const handleGetStarted = () => {
    setShowAuth(true)
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowAuth(true)
    setLogoutDialogOpen(false) // Close the dialog after logging out
  }

  const handleSignUp = () => {
    setShowSignUp(false)
  }

  const handleToggleSignUp = () => {
    setShowSignUp(true)
  }

  const handleToggleLogin = () => {
    setShowSignUp(false)
  }

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true)
  }

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false)
  }

  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    addNotification('New task added successfully!');
  };

  const handleToggleTask = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    addNotification('Task deleted successfully!');
  };

  if (!currentUser) {
    if (!showAuth) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LandingPage onGetStarted={handleGetStarted} />
        </ThemeProvider>
      )
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showSignUp ? (
          <SignUp onSignUp={handleSignUp} onToggleLogin={handleToggleLogin} />
        ) : (
          <Login onLogin={handleLogin} onToggleSignUp={handleToggleSignUp} />
        )}
      </ThemeProvider>
    )
  }

  // Render the dashboard when the user is logged in
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
              aria-label="app tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab 
                label="Dashboard" 
                icon={<DashboardOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
              />
              <Tab 
                label="Tasks" 
                icon={<AssignmentOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
              />
              <Tab 
                label="Milestones" 
                icon={<FlagOutlinedIcon sx={{ fontSize: '1.25rem' }} />}
                iconPosition="start"
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
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <MilestoneTracker 
              milestones={milestones} 
              setMilestones={setMilestones} 
              addNotification={addNotification}
            />
          </TabPanel>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
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
  )
}

export default App
