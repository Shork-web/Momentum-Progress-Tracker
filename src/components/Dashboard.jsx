import React from 'react';
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
  Container 
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

function Dashboard({ tasks, milestones }) {
  const theme = useTheme();

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
        <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
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
                  icon={<FlagIcon fontSize="large" />}
                  title="Total Milestones"
                  value={milestones.length}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<TrendingUpIcon fontSize="large" />}
                  title="Completion Rate"
                  value={`${Math.round((taskStatus.completed / tasks.length) * 100)}%`}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCardContent
                  icon={<CheckCircleOutlineIcon fontSize="large" />}
                  title="Completed Tasks"
                  value={taskStatus.completed}
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
                  minHeight: 450,
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
                      {upcomingTasks.map((task) => (
                        <ListItem 
                          key={task.id}
                          sx={{ 
                            mb: 1,
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
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                fontWeight="medium"
                                sx={{ mb: 1 }}
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
                      {upcomingTasks.length === 0 && (
                        <Box sx={{ 
                          textAlign: 'center',
                          py: 4,
                          color: theme.palette.text.secondary,
                        }}>
                          No upcoming tasks
                        </Box>
                      )}
                    </List>
                  </Box>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <StyledPaper sx={{ 
                  minHeight: 450,
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
                  minHeight: 450,
                  p: 2,
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                    Milestone Progress
                  </Typography>
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
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: 2 
                  }}>
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
};

export default Dashboard;
