import PropTypes from 'prop-types';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Checkbox, 
  IconButton, 
  Fab,
  Tooltip,
  Chip,
  Avatar,
  Grid,
  useTheme,
  Paper,
  useMediaQuery,
  Container
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

const TaskContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #3a3a3a 90%)'
    : 'linear-gradient(145deg, #f0f0f0 30%, #ffffff 90%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  height: '100%',
  boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
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

const PriorityIndicator = styled(Box)(({ priority }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '4px',
  backgroundColor: priority === 'high' ? '#ef4444' : 
                  priority === 'medium' ? '#f59e0b' : '#22c55e',
}));

const priorityColors = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444'
};

function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask, milestones }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const TaskSection = ({ title, tasks, type }) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          color: theme.palette.text.primary,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {title}
        <Chip 
          label={tasks.length}
          size="small"
          sx={{ 
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
        overflow: 'auto',
        pr: 1,
        height: 'calc(100vh - 300px)',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'dark' ? 'rgba(241, 245, 249, 0.1)' : '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'dark' ? 'rgba(203, 213, 225, 0.3)' : '#cbd5e1',
          borderRadius: '4px',
        },
      }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} elevation={0}>
            <PriorityIndicator priority={task.priority} />
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
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
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: task.completed 
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      mb: task.description ? 1 : 0,
                    }}
                  >
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        mb: 1.5,
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: priorityColors[task.priority],
                      fontSize: '0.75rem',
                    }}>
                      <FlagIcon sx={{ fontSize: '0.875rem' }} />
                      {task.priority}
                    </Box>
                    {task.dueDate && (
                      <Chip
                        icon={<CalendarTodayIcon sx={{ fontSize: '0.875rem' }} />}
                        label={formatDate(task.dueDate)}
                        size="small"
                        sx={{ 
                          height: 24,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(241, 245, 249, 0.1)'
                            : '#f8fafc',
                          color: theme.palette.text.secondary,
                          '& .MuiChip-label': { px: 1 },
                          '& .MuiChip-icon': { 
                            ml: 1,
                            color: theme.palette.text.secondary,
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
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
              </Box>
            </Box>
          </TaskCard>
        ))}
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
      height: '100vh',
      backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8fafc',
      py: 3,
      overflow: 'hidden',
    }}>
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Stats Section */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <StatCardContent
                  icon={<AssignmentIcon />}
                  title="Total Tasks"
                  value={tasks.length}
                  color="#0ea5e9"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCardContent
                  icon={<CheckCircleOutlineIcon />}
                  title="Completed Tasks"
                  value={tasks.filter(task => task.completed).length}
                  color="#22c55e"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCardContent
                  icon={<PendingActionsIcon />}
                  title="Active Tasks"
                  value={tasks.filter(task => !task.completed).length}
                  color="#f59e0b"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Tasks Section */}
          <Grid item xs={12} sx={{ 
            height: 'calc(100vh - 200px)',
            overflow: 'hidden'
          }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                <TaskContainer>
                  <TaskSection 
                    title="Active Tasks" 
                    tasks={tasks.filter(task => !task.completed)}
                    type="active"
                  />
                </TaskContainer>
              </Grid>
              <Grid item xs={12} md={6} sx={{ height: '100%' }}>
                <TaskContainer>
                  <TaskSection 
                    title="Completed" 
                    tasks={tasks.filter(task => task.completed)}
                    type="completed"
                  />
                </TaskContainer>
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
        onClose={() => setIsFormOpen(false)}
        onAddTask={onAddTask}
        existingMilestones={milestones}
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
  milestones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
    })
  ).isRequired,
};

export default TaskList;
