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
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskForm from './TaskForm';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 0,
  background: '#ffffff',
  boxShadow: 'none',
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const TaskCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: '#f8f9fa',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 20,
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.09)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-icon': {
    fontSize: '0.875rem',
  },
}));

const priorityColors = {
  low: { bg: '#EBF5FF', text: '#2B6CB0' },
  medium: { bg: '#FEFCBF', text: '#B7791F' },
  high: { bg: '#FED7D7', text: '#C53030' }
};

function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const StatCardContent = ({ icon, title, value, color }) => (
    <StatCard>
      <Avatar 
        sx={{ 
          bgcolor: `${color}15`,
          color: color,
          width: isMobile ? 40 : 48, 
          height: isMobile ? 40 : 48 
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {title}
        </Typography>
      </Box>
    </StatCard>
  );

  const TaskSection = ({ title, tasks }) => (
    <StyledPaper>
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        sx={{ 
          mb: 3, 
          fontWeight: 600, 
          color: '#2C3E50',
          fontSize: isMobile ? '1.1rem' : '1.25rem'
        }}
      >
        {title} ({tasks.length})
      </Typography>
      <Box sx={{ 
        maxHeight: '70vh',
        overflow: 'auto',
        pr: 2,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '2px',
          '&:hover': {
            background: '#94a3b8',
          },
        },
      }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                sx={{
                  color: '#cbd5e1',
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                  [theme.breakpoints.down('sm')]: {
                    padding: '4px',
                  },
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant={isMobile ? "body1" : "subtitle1"}
                  sx={{
                    fontWeight: 500,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : '#2C3E50',
                    mb: 1,
                  }}
                >
                  {task.title}
                </Typography>
                {task.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {task.description}
                  </Typography>
                )}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  <StyledChip
                    size="small"
                    label={task.priority}
                    sx={{
                      backgroundColor: priorityColors[task.priority].bg,
                      color: priorityColors[task.priority].text,
                    }}
                  />
                  {task.dueDate && (
                    <StyledChip
                      size="small"
                      icon={<CalendarTodayIcon sx={{ fontSize: '0.875rem' }} />}
                      label={formatDate(task.dueDate)}
                      variant="outlined"
                      sx={{ borderColor: '#cbd5e1', color: '#64748b' }}
                    />
                  )}
                </Box>
              </Box>
              <IconButton 
                onClick={() => onDeleteTask(task.id)}
                sx={{ 
                  color: '#cbd5e1',
                  padding: isMobile ? '4px' : '8px',
                  '&:hover': { 
                    color: '#e74c3c',
                    backgroundColor: '#fee2e2',
                  }
                }}
              >
                <DeleteIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
              </IconButton>
            </Box>
          </TaskCard>
        ))}
        {tasks.length === 0 && (
          <Box sx={{ 
            textAlign: 'center',
            py: 4,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
          }}>
            <Typography color="text.secondary">
              No tasks yet
            </Typography>
          </Box>
        )}
      </Box>
    </StyledPaper>
  );

  return (
    <Box sx={{ 
      width: '100%',
      height: 'auto',
      minHeight: 'calc(100vh - 84px)',
      backgroundColor: '#f1f5f9',
    }}>
      <Box sx={{ 
        px: isMobile ? 2 : 3, 
        py: 2, 
        borderBottom: '1px solid rgba(0,0,0,0.1)' 
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <StatCardContent
              icon={<AssignmentIcon />}
              title="Total Tasks"
              value={tasks.length}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCardContent
              icon={<CheckCircleOutlineIcon />}
              title="Completed"
              value={completedTasks.length}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCardContent
              icon={<PendingActionsIcon />}
              title="Pending"
              value={incompleteTasks.length}
              color={theme.palette.warning.main}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container sx={{ minHeight: 'calc(100vh - 212px)' }}>
        <Grid item xs={12} md={6} sx={{ 
          borderRight: { md: '1px solid rgba(0,0,0,0.1)' },
          borderBottom: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' }
        }}>
          <TaskSection title="In Progress" tasks={incompleteTasks} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskSection title="Completed" tasks={completedTasks} />
        </Grid>
      </Grid>

      <Tooltip title="Add Task">
        <Fab 
          color="primary" 
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 16 : 24,
            right: isMobile ? 16 : 24,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              transform: 'scale(1.1)',
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
