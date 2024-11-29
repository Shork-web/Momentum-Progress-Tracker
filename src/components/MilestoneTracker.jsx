import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import dayjs from 'dayjs';
import { 
  TextField, Button, Typography, Box, IconButton, Chip, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  LinearProgress, Card, CardContent, CardHeader, Paper,
  Grid, Collapse, Avatar
} from '@mui/material';
import StorageService from '../services/storage';
import PropTypes from 'prop-types';

// Styled components matching TaskList design
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2c2c2c 30%, #353535 90%)'
    : 'linear-gradient(145deg, #f8f9fa 30%, #ffffff 90%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px 0 rgba(0, 0, 0, 0.4)'
      : '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
  },
}));

const MilestoneBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const MilestoneTracker = ({ milestones, setMilestones, addNotification, tasks }) => {
  const theme = useTheme();
  const [newMilestone, setNewMilestone] = useState('');
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [taskMap, setTaskMap] = useState({});

  // Create a map of task IDs to task titles
  useEffect(() => {
    const map = tasks.reduce((acc, task) => {
      acc[task.id] = task.title;
      return acc;
    }, {});
    setTaskMap(map);
  }, [tasks]);

  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const taskId = milestone.taskId || 'unassigned';
    if (!acc[taskId]) {
      acc[taskId] = [];
    }
    acc[taskId].push(milestone);
    return acc;
  }, {});

  const calculateTaskProgress = (taskMilestones) => {
    if (taskMilestones.length === 0) return 0;
    const completedCount = taskMilestones.filter(m => m.completed).length;
    return (completedCount / taskMilestones.length) * 100;
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const toggleMilestone = (id) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
    ));
  };

  const deleteMilestone = async (id) => {
    try {
      await StorageService.deleteMilestone(id);
      setMilestones(prev => prev.filter(milestone => milestone.id !== id));
      addNotification('Milestone deleted');
    } catch (error) {
      console.error('Failed to delete milestone:', error);
      addNotification('Failed to delete milestone', 'error');
    }
  };

  const openEditDialog = (milestone) => {
    setEditingMilestone(milestone);
    setDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingMilestone(null);
    setDialogOpen(false);
  };

  const saveEditedMilestone = () => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === editingMilestone.id ? editingMilestone : milestone
    ));
    closeEditDialog();
    addNotification('Milestone updated');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMilestone(prev => ({ ...prev, [name]: name === 'dueDate' ? dayjs(value).toDate() : value }));
  };

  return (
    <StyledPaper>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        color="primary" 
        sx={{ 
          mb: 3,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #0ea5e9 30%, #0284c7 90%)'
            : undefined,
          WebkitBackgroundClip: theme.palette.mode === 'dark' ? 'text' : undefined,
          WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : undefined,
        }}
      >
        Milestones
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={3}>
          {Object.entries(groupedMilestones).map(([taskId, taskMilestones], index) => {
            const taskProgress = calculateTaskProgress(taskMilestones);
            const isExpanded = expandedTasks[taskId] || false;
            const completedCount = taskMilestones.filter(m => m.completed).length;
            const taskTitle = taskId === 'unassigned' ? 'Unassigned Milestones' : taskMap[taskId] || `Task ${index + 1}`;

            return (
              <Grid item xs={12} sm={6} key={taskId}>
                <StyledCard>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)',
                        color: '#0ea5e9'
                      }}>
                        <AssignmentIcon />
                      </Avatar>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold"
                          sx={{ 
                            color: theme.palette.mode === 'dark' 
                              ? theme.palette.grey[100] 
                              : theme.palette.grey[800],
                            flexGrow: 1,
                            mr: 2
                          }}
                        >
                          {taskTitle}
                        </Typography>
                        <Box>
                          <Chip 
                            size="small" 
                            label={`${completedCount}/${taskMilestones.length}`}
                            sx={{ 
                              mr: 1,
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(224, 242, 254, 0.1)'
                                : '#e0f2fe',
                              color: theme.palette.mode === 'dark' 
                                ? '#38bdf8' 
                                : '#0284c7',
                              fontWeight: 600,
                            }}
                          />
                          <IconButton
                            onClick={() => toggleExpand(taskId)}
                            sx={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                              color: theme.palette.mode === 'dark' 
                                ? theme.palette.grey[400] 
                                : theme.palette.grey[700],
                            }}
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                  <LinearProgress 
                    variant="determinate" 
                    value={taskProgress}
                    sx={{ 
                      mx: 2, 
                      mb: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)'
                          : undefined,
                      },
                    }}
                  />
                  <Collapse in={isExpanded} timeout="auto">
                    <CardContent>
                      {taskMilestones.map(milestone => (
                        <MilestoneBox key={milestone.id}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="medium"
                            sx={{ 
                              textDecoration: milestone.completed ? 'line-through' : 'none',
                              color: milestone.completed
                                ? theme.palette.text.secondary
                                : theme.palette.text.primary,
                            }}
                          >
                            {milestone.title}
                          </Typography>
                          {milestone.dueDate && (
                            <Chip
                              icon={<EventIcon sx={{ fontSize: '0.875rem' }} />}
                              label={dayjs(milestone.dueDate).format('MMM D, YYYY')}
                              size="small"
                              sx={{ 
                                mt: 1,
                                height: 24,
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(241, 245, 249, 0.1)'
                                  : '#f8fafc',
                                color: theme.palette.text.secondary,
                              }}
                            />
                          )}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1,
                              color: theme.palette.text.secondary,
                              transition: 'color 0.2s ease',
                              '&:hover': {
                                color: theme.palette.text.primary,
                              },
                            }}
                          >
                            {milestone.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Tooltip title={milestone.completed ? "Mark as Incomplete" : "Mark as Complete"}>
                              <Chip
                                icon={<CheckCircleOutlineIcon />}
                                label={milestone.completed ? "Completed" : "In Progress"}
                                color={milestone.completed ? "success" : "primary"}
                                onClick={() => toggleMilestone(milestone.id)}
                                size="small"
                                sx={{ 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    transform: 'scale(1.02)',
                                  },
                                }}
                              />
                            </Tooltip>
                            <Box>
                              <IconButton 
                                size="small" 
                                onClick={() => openEditDialog(milestone)}
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
                                <MoreVertIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => deleteMilestone(milestone.id)}
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
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </MilestoneBox>
                      ))}
                    </CardContent>
                  </Collapse>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Dialog 
        open={dialogOpen} 
        onClose={closeEditDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? '#1e293b' 
              : '#ffffff',
          }
        }}
      >
        <DialogTitle>Edit Milestone</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Milestone Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editingMilestone?.name || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editingMilestone?.description || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={editingMilestone?.dueDate ? dayjs(editingMilestone.dueDate).format('YYYY-MM-DD') : ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={saveEditedMilestone} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

MilestoneTracker.propTypes = {
  milestones: PropTypes.array.isRequired,
  setMilestones: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired
};

MilestoneTracker.defaultProps = {
  tasks: [],
  milestones: []
};

export default MilestoneTracker;