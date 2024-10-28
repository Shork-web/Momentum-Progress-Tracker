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
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TaskForm from './TaskForm';

const StyledPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #3a3a3a 90%)'
    : 'linear-gradient(145deg, #f0f0f0 30%, #ffffff 90%)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px 0 rgba(0, 0, 0, 0.2)',
  },
}));

const TaskCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const StatCard = ({ icon, title, value, color }) => {
  return (
    <StyledPaper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, height: '100%' }}>
      <Avatar sx={{ bgcolor: color, mb: 2, width: 56, height: 56 }}>{icon}</Avatar>
      <Typography variant="h6" fontWeight="bold" align="center">{value}</Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{title}</Typography>
    </StyledPaper>
  );
};

function TaskList({ tasks, onToggleTask, onDeleteTask, onAddTask }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const TaskSection = ({ title, tasks }) => (
    <StyledPaper sx={{ mb: 4, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        {title} ({tasks.length})
      </Typography>
      {tasks.map((task) => (
        <TaskCard key={task.id}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              sx={{ mt: 0.5 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                }}
              >
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {task.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Chip
                  size="small"
                  label={task.priority}
                  color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'}
                />
                {task.dueDate && (
                  <Chip
                    size="small"
                    icon={<CalendarTodayIcon />}
                    label={formatDate(task.dueDate)}
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
            <IconButton onClick={() => onDeleteTask(task.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </TaskCard>
      ))}
      {tasks.length === 0 && (
        <Typography color="text.secondary" align="center">
          No tasks yet
        </Typography>
      )}
    </StyledPaper>
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      height: 'calc(100vh - 64px)',
      overflow: 'auto', 
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.default,
      '&::-webkit-scrollbar': {
        width: '0.4em'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
      }
    }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<AssignmentIcon fontSize="large" />}
            title="Total Tasks"
            value={tasks.length}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<CheckCircleOutlineIcon fontSize="large" />}
            title="Completed Tasks"
            value={completedTasks.length}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            icon={<AssignmentIcon fontSize="large" />}
            title="Pending Tasks"
            value={incompleteTasks.length}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
            bottom: 24,
            right: 24,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s'
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
