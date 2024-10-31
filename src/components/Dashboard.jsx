import React from 'react'
import { Typography, Grid, Paper, List, ListItem, ListItemText, useTheme, Box, Chip, Avatar } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { styled } from '@mui/material/styles'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FlagIcon from '@mui/icons-material/Flag'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PropTypes from 'prop-types'

const StyledPaper = styled(Paper)(({ theme }) => ({
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
}))

const StatCard = ({ icon, title, value, color, trend }) => {
  const theme = useTheme()
  return (
    <StyledPaper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, height: '100%' }}>
      <Avatar sx={{ bgcolor: color, mb: 2, width: 56, height: 56 }}>{icon}</Avatar>
      <Typography variant="h6" fontWeight="bold" align="center">{value}</Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{title}</Typography>
      {trend && (
        <Chip 
          label={`${trend > 0 ? '+' : ''}${trend}%`} 
          color={trend > 0 ? 'success' : 'error'} 
          size="small" 
          sx={{ mt: 2 }}
        />
      )}
    </StyledPaper>
  )
}

const UpcomingTaskItem = ({ task, getPriorityColor }) => {
  const theme = useTheme();
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ListItem 
      disablePadding 
      sx={{ 
        mb: 2,
        p: 2,
        borderRadius: theme.spacing(1),
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #2c2c2c 30%, #353535 90%)'
          : 'linear-gradient(145deg, #f8f9fa 30%, #ffffff 90%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <ListItemText 
        primary={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {task.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: getPriorityColor(task.priority),
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
        }
      />
    </ListItem>
  );
};

function Dashboard({ tasks, milestones }) {
  const theme = useTheme()

  const taskStatus = tasks.reduce((acc, task) => {
    acc[task.completed ? 'completed' : 'pending']++
    return acc
  }, { completed: 0, pending: 0 })

  const milestoneStatus = milestones.reduce((acc, milestone) => {
    acc[milestone.completed ? 'completed' : 'pending']++
    return acc
  }, { completed: 0, pending: 0 })

  const taskData = [
    { name: 'Completed', value: taskStatus.completed },
    { name: 'Pending', value: taskStatus.pending },
  ]

  const milestoneData = [
    { name: 'Completed', value: milestoneStatus.completed },
    { name: 'Pending', value: milestoneStatus.pending },
  ]

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main]

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const upcomingMilestones = milestones
    .filter(milestone => !milestone.completed && milestone.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const taskPriorities = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {})

  const priorityData = Object.entries(taskPriorities).map(([name, value]) => ({ name, value }))

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main
      case 'medium': return theme.palette.warning.main
      case 'low': return theme.palette.success.main
      default: return theme.palette.info.main
    }
  }

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<AssignmentIcon fontSize="large" />} 
            title="Total Tasks" 
            value={tasks.length} 
            color={theme.palette.primary.main}
            trend={5}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<FlagIcon fontSize="large" />} 
            title="Total Milestones" 
            value={milestones.length} 
            color={theme.palette.secondary.main}
            trend={2}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<TrendingUpIcon fontSize="large" />} 
            title="Completion Rate" 
            value={`${Math.round((taskStatus.completed / tasks.length) * 100)}%`} 
            color={theme.palette.success.main}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<CheckCircleOutlineIcon fontSize="large" />} 
            title="Completed Tasks" 
            value={taskStatus.completed} 
            color={theme.palette.info.main}
            trend={3}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3} sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ px: 2, pt: 1 }}>
              Upcoming Tasks
            </Typography>
            <List sx={{ 
              flexGrow: 1, 
              overflow: 'auto', 
              px: 2,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(241, 245, 249, 0.1)' 
                  : '#f1f5f9',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(203, 213, 225, 0.3)' 
                  : '#cbd5e1',
                borderRadius: '4px',
              },
            }}>
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <UpcomingTaskItem 
                    key={task.id} 
                    task={task} 
                    getPriorityColor={getPriorityColor}
                  />
                ))
              ) : (
                <Box sx={{ 
                  textAlign: 'center',
                  py: 4,
                  color: theme.palette.text.secondary,
                }}>
                  No upcoming tasks
                </Box>
              )}
            </List>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3} sx={{ height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task Progress</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3} sx={{ height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Task Priorities</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis type="number" stroke={theme.palette.text.secondary} />
                <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

UpcomingTaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']),
    dueDate: PropTypes.string,
  }).isRequired,
  getPriorityColor: PropTypes.func.isRequired,
};

export default Dashboard
