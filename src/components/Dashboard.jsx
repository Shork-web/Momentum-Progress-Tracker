import React from 'react'
import { Typography, Grid, Paper, List, ListItem, ListItemText, useTheme, Box, Chip, Avatar } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { styled } from '@mui/material/styles'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FlagIcon from '@mui/icons-material/Flag'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

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
    .filter(task => !task.completed && task.dueDate)
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

  // Mock data for progress over time
  const progressData = [
    { name: 'Week 1', tasks: 4, milestones: 1 },
    { name: 'Week 2', tasks: 7, milestones: 2 },
    { name: 'Week 3', tasks: 12, milestones: 3 },
    { name: 'Week 4', tasks: 18, milestones: 4 },
  ]

  return (
    <Box sx={{ 
      flexGrow: 1, 
      height: 'calc(100vh - 64px)', // Subtract the AppBar height
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
        <Grid item xs={12} md={8}>
          <StyledPaper elevation={3} sx={{ height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Progress Over Time</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke={theme.palette.primary.main} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="milestones" stroke={theme.palette.secondary.main} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3} sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Upcoming Tasks</Typography>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {upcomingTasks.map(task => (
                <ListItem key={task.id} disablePadding sx={{ mb: 2 }}>
                  <ListItemText 
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ mr: 1, fontWeight: 'medium' }}>{task.name}</Typography>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          sx={{ backgroundColor: getPriorityColor(task.priority), color: 'white' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" component="span" color="text.secondary">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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

export default Dashboard
