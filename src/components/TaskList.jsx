import { useState } from 'react';
import { 
  Box, Typography, Checkbox, IconButton, Fab, Tooltip, Chip,
  Avatar, Grid, useTheme, Paper, useMediaQuery, Container, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TaskForm from './TaskForm';
import FlagIcon from '@mui/icons-material/Flag';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #3a3a3a 90%)'
    : 'linear-gradient(145deg, #f0f0f0 30%, #ffffff 90%)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px 0 rgba(0, 0, 0, 0.2)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #3a3a3a 90%)'
    : 'linear-gradient(145deg, #f0f0f0 30%, #ffffff 90%)',
  boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px 0 rgba(0, 0, 0, 0.2)',
  },
}));

const TaskCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #353535 90%)'
    : 'linear-gradient(145deg, #f8f9fa 30%, #ffffff 90%)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px 0 rgba(0, 0, 0, 0.4)'
      : '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
  },
}));

// Add this constant for priority colors
const priorityColors = {
  high: {
    light: '#ef4444',  // red
    dark: '#dc2626',
    bg: 'rgba(239, 68, 68, 0.1)'
  },
  medium: {
    light: '#f59e0b',  // amber
    dark: '#d97706',
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  low: {
    light: '#22c55e',  // green
    dark: '#16a34a',
    bg: 'rgba(34, 197, 94, 0.1)'
  }
};

function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask, milestones }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Add this state to track expanded descriptions
  const [expandedTasks, setExpandedTasks] = useState({});

  // Add this handler to toggle description expansion
  const toggleDescription = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatCardContent = ({ icon, title, value, color }) => (
    <StatCard>
      <Avatar 
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? `${color}30` : `${color}15`,
          color: color,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography 
          variant="h5" 
          fontWeight="600" 
          color={theme.palette.text.primary}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          fontWeight={500}
        >
          {title}
        </Typography>
      </Box>
    </StatCard>
  );

  const handleEditTask = (task) => {
    if (task.completed) {
      return;
    }
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const TaskSection = ({ title, tasks, type }) => (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        fontWeight="bold" 
        sx={{ px: 1, mb: 1 }}
      >
        {title}
        <Chip 
          label={tasks.length}
          size="small"
          sx={{ 
            ml: 1,
            backgroundColor: type === 'completed' 
              ? theme.palette.mode === 'dark' ? 'rgba(226, 232, 240, 0.1)' : '#e2e8f0'
              : theme.palette.mode === 'dark' ? 'rgba(224, 242, 254, 0.1)' : '#e0f2fe',
            color: type === 'completed' 
              ? theme.palette.mode === 'dark' ? '#94a3b8' : '#475569'
              : theme.palette.mode === 'dark' ? '#38bdf8' : '#0284c7',
            fontWeight: 600,
          }}
        />
      </Typography>

      <Box sx={{ 
        flexGrow: 1,
        height: { xs: '400px', md: 'calc(100vh - 350px)' },
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' ? 'rgba(241, 245, 249, 0.1)' : '#f1f5f9',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? 'rgba(203, 213, 225, 0.3)' : '#cbd5e1',
          borderRadius: '4px',
        },
        pr: 1,
        mr: -1,
      }}>
        <List sx={{ py: 0 }}>
          {tasks.map((task) => (
            <ListItem 
              key={task.id}
              sx={{ 
                mb: 1,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                borderLeft: !task.completed ? `4px solid ${priorityColors[task.priority || 'low'].light}` : 'none',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                position: 'relative',
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
                    '&.Mui-checked': {
                      color: '#0ea5e9',
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="medium"
                      sx={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed 
                          ? theme.palette.text.secondary
                          : theme.palette.text.primary,
                      }}
                    >
                      {task.title}
                    </Typography>
                    {!task.completed && (
                      <Chip
                        label={task.priority || 'low'}
                        size="small"
                        sx={{ 
                          height: 20,
                          backgroundColor: priorityColors[task.priority || 'low'].bg,
                          color: priorityColors[task.priority || 'low'].light,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {task.description && (
                      <Box sx={{ position: 'relative' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: expandedTasks[task.id] ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                            cursor: 'pointer',
                            pr: 6, // Make room for action buttons
                            '&:hover': {
                              color: theme.palette.text.primary,
                            },
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => toggleDescription(task.id)}
                        >
                          {task.description}
                        </Typography>
                        {task.description.length > 120 && (
                          <Button
                            size="small"
                            onClick={() => toggleDescription(task.id)}
                            sx={{ 
                              textTransform: 'none',
                              minWidth: 'auto',
                              p: 0.5,
                              mt: 0.5,
                              color: theme.palette.text.secondary,
                              '&:hover': {
                                backgroundColor: 'transparent',
                                color: theme.palette.primary.main,
                              }
                            }}
                          >
                            {expandedTasks[task.id] ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </Box>
                    )}
                    {task.dueDate && (
                      <Chip
                        icon={<CalendarTodayIcon sx={{ fontSize: '0.875rem' }} />}
                        label={formatDate(task.dueDate)}
                        size="small"
                        sx={{ 
                          height: 24,
                          width: 'fit-content',
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(241, 245, 249, 0.1)'
                            : '#f8fafc',
                          color: theme.palette.text.secondary,
                        }}
                      />
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction sx={{ 
                display: 'flex', 
                gap: 1,
                position: 'absolute',
                right: 8,
                top: 8,
                transform: 'none',
              }}>
                {!task.completed && (
                  <IconButton 
                    onClick={() => handleEditTask(task)}
                    size="small"
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
                      '&:hover': { 
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(14, 165, 233, 0.1)'
                          : 'rgba(14, 165, 233, 0.1)',
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton 
                  onClick={() => onDeleteTask(task.id)}
                  size="small"
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
                    '&:hover': { 
                      color: '#ef4444',
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(254, 226, 226, 0.1)'
                        : '#fee2e2',
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {tasks.length === 0 && (
          <Box sx={{ 
            textAlign: 'center',
            py: 4,
            color: theme.palette.text.secondary,
          }}>
            No tasks yet
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
    }}>
      <Container maxWidth="xl" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        py: 2,
        px: { xs: 2, sm: 2 },
        height: '100%',
        overflow: 'hidden',
      }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Stats Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<AssignmentIcon fontSize="large" />}
                  title="Total Tasks"
                  value={tasks.length}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<CheckCircleOutlineIcon fontSize="large" />}
                  title="Completed Tasks"
                  value={tasks.filter(task => task.completed).length}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<PendingActionsIcon fontSize="large" />}
                  title="Active Tasks"
                  value={tasks.filter(task => !task.completed).length}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<FlagIcon fontSize="large" />}
                  title="Completion Rate"
                  value={`${Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) || 0}%`}
                  color={theme.palette.info.main}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Tasks Section */}
          <Grid item xs={12} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ 
                  height: '100%',
                  minHeight: { xs: '400px', lg: '450px' },
                  maxHeight: { xs: '400px', lg: '450px' },
                }}>
                  <TaskSection 
                    title="Active Tasks" 
                    tasks={tasks.filter(task => !task.completed)}
                    type="active"
                  />
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledPaper sx={{ 
                  height: '100%',
                  minHeight: { xs: '400px', lg: '450px' },
                  maxHeight: { xs: '400px', lg: '450px' },
                }}>
                  <TaskSection 
                    title="Completed" 
                    tasks={tasks.filter(task => task.completed)}
                    type="completed"
                  />
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Tooltip title="Add Task">
        <Fab 
          color="primary" 
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #0ea5e9 30%, #0284c7 90%)'
              : '#0ea5e9',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #0284c7 30%, #0369a1 90%)'
                : '#0284c7',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <TaskForm 
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onAddTask={onAddTask}
        existingMilestones={milestones}
        editingTask={editingTask}
      />
    </Box>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.oneOf(['low', 'medium', 'high']),
      dueDate: PropTypes.string,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  milestones: PropTypes.array.isRequired,
};

export default TaskList;
