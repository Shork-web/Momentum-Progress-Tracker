import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  useTheme, 
  Box, 
  Chip, 
  Avatar,
  Container,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlagIcon from '@mui/icons-material/Flag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PropTypes from 'prop-types';
import StorageService from '../services/storage';

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

function Dashboard({ tasks, milestones, currentUser }) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const taskStats = await StorageService.getTaskStatistics(currentUser.id);
        setStats(taskStats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [tasks, milestones, currentUser.id]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const taskStatus = tasks.reduce((acc, task) => {
    acc[task.completed ? 'completed' : 'pending']++;
    return acc;
  }, { completed: 0, pending: 0 });

  const milestoneStatus = milestones.reduce((acc, milestone) => {
    acc[milestone.completed ? 'completed' : 'pending']++;
    return acc;
  }, { completed: 0, pending: 0 });

  const taskData = [
    { name: 'Completed', value: taskStatus.completed },
    { name: 'Pending', value: taskStatus.pending },
  ];

  const milestoneData = [
    { 
      name: 'Completed', 
      value: milestoneStatus.completed,
      fill: theme.palette.success.main 
    },
    { 
      name: 'In Progress', 
      value: milestoneStatus.pending,
      fill: theme.palette.warning.main 
    },
    { 
      name: 'Total', 
      value: milestones.length,
      fill: theme.palette.primary.main 
    }
  ];

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        py: 2,
        px: { xs: 2, sm: 2 },
        height: '100%',
        overflow: 'hidden',
      }}>
        <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
          {/* Stats Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<AssignmentIcon fontSize="large" />}
                  title="Total Tasks"
                  value={stats.totalTasks}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<FlagIcon fontSize="large" />}
                  title="Total Milestones"
                  value={stats.totalMilestones}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<TrendingUpIcon fontSize="large" />}
                  title="Completion Rate"
                  value={`${Math.round(stats.completionRate)}%`}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<CheckCircleOutlineIcon fontSize="large" />}
                  title="Completed Tasks"
                  value={stats.completedTasks}
                  color={theme.palette.info.main}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Charts and Tasks Section */}
          <Grid item xs={12} sx={{ flexGrow: 1, minHeight: 0 }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              <Grid item xs={12} lg={4}>
                <StyledPaper sx={{ 
                  height: '100%',
                  minHeight: { xs: '400px', lg: '450px' },
                  maxHeight: { xs: '400px', lg: '450px' },
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ px: 1, mb: 1 }}>
                    Upcoming Tasks
                  </Typography>
                  <Box sx={{ 
                    flexGrow: 1,
                    overflow: 'auto',
                    height: '100%',
                    maxHeight: 'calc(100% - 40px)',
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
                    <List sx={{ 
                      py: 0,
                      display: 'grid',
                      gridTemplateRows: 'repeat(auto-fill, minmax(80px, 1fr))',
                      gap: 1,
                    }}>
                      {upcomingTasks.slice(0, 4).map((task) => (
                        <ListItem 
                          key={task.id}
                          sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.palette.mode === 'dark'
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                : '0 4px 12px rgba(0, 0, 0, 0.1)',
                            },
                            height: '80px',
                            mb: 0,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                fontWeight="medium"
                                sx={{ 
                                  mb: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {task.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1 }}>
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
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                      {upcomingTasks.length > 4 && (
                        <Box sx={{ 
                          p: 1.5, 
                          textAlign: 'center',
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}>
                          Scroll to see {upcomingTasks.length - 4} more tasks
                        </Box>
                      )}
                      {upcomingTasks.slice(4).map((task) => (
                        <ListItem 
                          key={task.id}
                          sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.palette.mode === 'dark'
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                : '0 4px 12px rgba(0, 0, 0, 0.1)',
                            },
                            height: '80px',
                            mb: 0,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                fontWeight="medium"
                                sx={{ 
                                  mb: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {task.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1 }}>
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
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    {upcomingTasks.length === 0 && (
                      <Box sx={{ 
                        textAlign: 'center',
                        py: 4,
                        color: theme.palette.text.secondary,
                      }}>
                        No upcoming tasks
                      </Box>
                    )}
                  </Box>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <StyledPaper sx={{ 
                  height: '100%',
                  minHeight: { xs: '400px', lg: '450px' },
                  maxHeight: { xs: '400px', lg: '450px' },
                  p: 2,
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                    Task Progress
                  </Typography>
                  <Box sx={{ height: 'calc(100% - 40px)', minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
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
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <StyledPaper sx={{ 
                  height: '100%',
                  minHeight: { xs: '400px', lg: '450px' },
                  maxHeight: { xs: '400px', lg: '450px' },
                  p: 2,
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
                      Milestone Progress
                    </Typography>
                    <Chip
                      label={`${Math.round((milestoneStatus.completed / milestones.length) * 100)}% Complete`}
                      color="success"
                      size="small"
                      icon={<CheckCircleOutlineIcon />}
                      sx={{ 
                        fontWeight: 500,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : 'rgba(34, 197, 94, 0.1)',
                        color: theme.palette.mode === 'dark' 
                          ? theme.palette.success.light 
                          : theme.palette.success.dark,
                      }}
                    />
                  </Box>
                  <Box sx={{ height: 'calc(100% - 40px)', minHeight: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={milestoneData} layout="vertical">
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme.palette.divider}
                          horizontal={false}
                        />
                        <XAxis 
                          type="number" 
                          stroke={theme.palette.text.secondary}
                          tickFormatter={(value) => `${value}`}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke={theme.palette.text.secondary}
                          width={100}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme.palette.background.paper, 
                            borderRadius: 8,
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [`${value} Milestones`, name]}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[0, 4, 4, 0]}
                          barSize={30}
                        >
                          {milestoneData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.fill}
                              style={{
                                filter: 'brightness(1)',
                                transition: 'filter 0.3s ease-in-out',
                                ':hover': {
                                  filter: 'brightness(1.1)',
                                }
                              }}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

Dashboard.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  milestones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};

export default Dashboard;
