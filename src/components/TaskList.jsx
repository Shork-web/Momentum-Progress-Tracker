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
  background: '#ffffff',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.03)',
  border: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
}));

const TaskContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  height: '100%',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.03)',
  border: '1px solid #f0f0f0',
}));

const TaskCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid #f0f0f0',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
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

function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask }) {
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
          bgcolor: `${color}15`,
          color: color,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h5" fontWeight="600" color="#1e293b">
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: '#64748b', fontWeight: 500 }}
        >
          {title}
        </Typography>
      </Box>
    </StatCard>
  );

  const TaskSection = ({ title, tasks, type }) => (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          color: '#1e293b',
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
            backgroundColor: type === 'completed' ? '#e2e8f0' : '#e0f2fe',
            color: type === 'completed' ? '#475569' : '#0284c7',
            fontWeight: 600,
          }}
        />
      </Typography>

      <Box sx={{ 
        maxHeight: '70vh',
        overflow: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
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
                    color: '#cbd5e1',
                    '&.Mui-checked': {
                      color: '#0ea5e9',
                    },
                  }}
                />
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: task.completed ? '#94a3b8' : '#1e293b',
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
                        color: '#64748b',
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
                          backgroundColor: '#f8fafc',
                          '& .MuiChip-label': { px: 1 },
                          '& .MuiChip-icon': { ml: 1 },
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <IconButton 
                  onClick={() => onDeleteTask(task.id)}
                  size="small"
                  sx={{ 
                    color: '#cbd5e1',
                    '&:hover': { 
                      color: '#ef4444',
                      backgroundColor: '#fee2e2',
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
            color: '#94a3b8',
          }}>
            No tasks yet
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 3,
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
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
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TaskContainer>
                  <TaskSection 
                    title="Active Tasks" 
                    tasks={tasks.filter(task => !task.completed)}
                    type="active"
                  />
                </TaskContainer>
              </Grid>
              <Grid item xs={12} md={6}>
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
            backgroundColor: '#0ea5e9',
            '&:hover': {
              backgroundColor: '#0284c7',
              transform: 'scale(1.05)',
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
  onAddTask: PropTypes.func.isRequired
};

export default TaskList;
