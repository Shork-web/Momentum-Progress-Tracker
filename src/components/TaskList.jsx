import React, { useState, useMemo } from 'react'
import { 
  TextField, Button, Typography, Box, IconButton, Chip, Tooltip,
  Menu, Fade, FormControl, InputLabel, Select, MenuItem, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, LinearProgress,
  Card, CardContent, CardActions, CardHeader, Paper, Divider, Badge
} from '@mui/material'
import { styled, alpha, useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import FlagIcon from '@mui/icons-material/Flag'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import dayjs from 'dayjs'

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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)',
  },
}))

const GlassButton = styled(Button)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.1),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  color: theme.palette.primary.main,
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.2),
  },
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

function TaskList({ tasks, setTasks, addNotification }) {
  const theme = useTheme()
  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [anchorEl, setAnchorEl] = useState(null)

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = { 
        id: Date.now(), 
        name: newTask, 
        completed: false,
        priority: 'medium',
        dueDate: null,
        description: ''
      }
      setTasks(prev => [...prev, newTaskObj])
      setNewTask('')
      addNotification(`New task added: ${newTask}`)
    }
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    addNotification('Task deleted')
  }

  const openEditDialog = (task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingTask(null)
    setDialogOpen(false)
  }

  const saveEditedTask = () => {
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? editingTask : task
    ))
    closeEditDialog()
    addNotification('Task updated')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingTask(prev => ({ ...prev, [name]: name === 'dueDate' ? dayjs(value).toDate() : value }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main
      case 'medium': return theme.palette.warning.main
      case 'low': return theme.palette.success.main
      default: return theme.palette.text.secondary
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'all') return true
      if (filter === 'completed') return task.completed
      if (filter === 'active') return !task.completed
      return true
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })
  }, [tasks, filter, sortBy])

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getTaskStatusColor = (task) => {
    if (task.completed) return theme.palette.success.main
    if (task.dueDate && new Date(task.dueDate) < new Date()) return theme.palette.error.main
    return theme.palette.info.main
  }

  return (
    <StyledPaper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Tasks</Typography>
        <Box>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ mr: 1 }}>
            <FilterListIcon />
          </IconButton>
          <IconButton onClick={handleMenuOpen} size="small">
            <SortIcon />
          </IconButton>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => { setFilter('all'); handleMenuClose(); }}>All Tasks</MenuItem>
        <MenuItem onClick={() => { setFilter('active'); handleMenuClose(); }}>Active Tasks</MenuItem>
        <MenuItem onClick={() => { setFilter('completed'); handleMenuClose(); }}>Completed Tasks</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setSortBy('dueDate'); handleMenuClose(); }}>Sort by Due Date</MenuItem>
        <MenuItem onClick={() => { setSortBy('priority'); handleMenuClose(); }}>Sort by Priority</MenuItem>
      </Menu>
      <Box sx={{ p: 3, display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          size="small"
          sx={{ mr: 2, bgcolor: 'background.paper' }}
        />
        <GlassButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addTask}
        >
          ADD
        </GlassButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {filteredTasks.map(task => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <StyledCard>
                <CardHeader
                  avatar={
                    <StyledBadge
                      badgeContent={task.priority[0].toUpperCase()}
                      color={getPriorityColor(task.priority)}
                    >
                      <Avatar sx={{ bgcolor: getTaskStatusColor(task) }}>
                        {task.completed ? <CheckCircleOutlineIcon /> : <FlagIcon />}
                      </Avatar>
                    </StyledBadge>
                  }
                  action={
                    <IconButton onClick={() => openEditDialog(task)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.name}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        size="small"
                        label={task.priority}
                        sx={{ mr: 1, bgcolor: alpha(getPriorityColor(task.priority), 0.1), color: getPriorityColor(task.priority) }}
                      />
                      {task.dueDate && (
                        <Chip
                          icon={<EventIcon />}
                          label={dayjs(task.dueDate).format('MMM D, YYYY')}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Tooltip title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}>
                    <Chip
                      icon={<CheckCircleOutlineIcon />}
                      label={task.completed ? "Completed" : "In Progress"}
                      color={task.completed ? "success" : "primary"}
                      onClick={() => toggleTask(task.id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <IconButton size="small" onClick={() => deleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
                <LinearProgress 
                  variant="determinate" 
                  value={task.completed ? 100 : 0} 
                  sx={{ height: 3 }}
                />
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={dialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Task Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editingTask?.name || ''}
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
            value={editingTask?.description || ''}
            onChange={handleEditChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={editingTask?.priority || ''}
              onChange={handleEditChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={editingTask?.dueDate ? dayjs(editingTask.dueDate).format('YYYY-MM-DD') : ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={saveEditedTask} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  )
}

export default TaskList
