import React, { useState } from 'react'
import { styled, alpha, useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import FlagIcon from '@mui/icons-material/Flag'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import dayjs from 'dayjs'
import { 
  TextField, Button, Typography, Box, IconButton, Chip, Tooltip,
  Menu, Fade, MenuItem, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  Avatar, LinearProgress, Card, CardContent, CardActions, CardHeader, Paper, Divider
} from '@mui/material'

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

function MilestoneTracker({ milestones, setMilestones, addNotification }) {
  const theme = useTheme()
  const [newMilestone, setNewMilestone] = useState('')
  const [editingMilestone, setEditingMilestone] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [anchorEl, setAnchorEl] = useState(null)

  const addMilestone = () => {
    if (newMilestone.trim() !== '') {
      const newMilestoneObj = { 
        id: Date.now(), 
        name: newMilestone, 
        completed: false,
        dueDate: null,
        description: ''
      }
      setMilestones(prev => [...prev, newMilestoneObj])
      setNewMilestone('')
      addNotification(`New milestone added: ${newMilestone}`)
    }
  }

  const toggleMilestone = (id) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
    ))
  }

  const deleteMilestone = (id) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== id))
    addNotification('Milestone deleted')
  }

  const openEditDialog = (milestone) => {
    setEditingMilestone(milestone)
    setDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingMilestone(null)
    setDialogOpen(false)
  }

  const saveEditedMilestone = () => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === editingMilestone.id ? editingMilestone : milestone
    ))
    closeEditDialog()
    addNotification('Milestone updated')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingMilestone(prev => ({ ...prev, [name]: name === 'dueDate' ? dayjs(value).toDate() : value }))
  }

  const filteredMilestones = milestones.filter(milestone => {
    if (filter === 'all') return true
    if (filter === 'completed') return milestone.completed
    if (filter === 'active') return !milestone.completed
    return true
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return 0
  })

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getMilestoneStatusColor = (milestone) => {
    if (milestone.completed) return theme.palette.success.main
    if (milestone.dueDate && new Date(milestone.dueDate) < new Date()) return theme.palette.error.main
    return theme.palette.info.main
  }

  return (
    <StyledPaper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" fontWeight="bold" color="primary">Milestones</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          {filteredMilestones.map(milestone => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={milestone.id}>
              <StyledCard>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: getMilestoneStatusColor(milestone) }}>
                      {milestone.completed ? <CheckCircleOutlineIcon /> : <FlagIcon />}
                    </Avatar>
                  }
                  action={
                    <IconButton onClick={() => openEditDialog(milestone)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: milestone.completed ? 'line-through' : 'none' }}>
                      {milestone.name}
                    </Typography>
                  }
                  subheader={
                    milestone.dueDate && (
                      <Chip
                        icon={<EventIcon />}
                        label={dayjs(milestone.dueDate).format('MMM D, YYYY')}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {milestone.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Tooltip title={milestone.completed ? "Mark as Incomplete" : "Mark as Complete"}>
                    <Chip
                      icon={<CheckCircleOutlineIcon />}
                      label={milestone.completed ? "Completed" : "In Progress"}
                      color={milestone.completed ? "success" : "primary"}
                      onClick={() => toggleMilestone(milestone.id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <IconButton size="small" onClick={() => deleteMilestone(milestone.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
                <LinearProgress 
                  variant="determinate" 
                  value={milestone.completed ? 100 : 0} 
                  sx={{ height: 3 }}
                />
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={dialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
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
  )
}

export default MilestoneTracker
