import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 2px rgba(44, 62, 80, 0.1)',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#f8f9fa',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
  '&.Mui-focused': {
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 2px rgba(44, 62, 80, 0.1)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

function TaskForm({ open, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date()
    });

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight="600" sx={{ color: '#2C3E50' }}>
          Add New Task
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                autoFocus
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddTaskOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                label="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <StyledSelect
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FlagOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                type="date"
                label="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <StyledButton onClick={handleClose} variant="outlined" color="inherit">
            Cancel
          </StyledButton>
          <StyledButton type="submit" variant="contained" color="primary">
            Add Task
          </StyledButton>
        </DialogActions>
      </form>
    </StyledDialog>
  );
}

TaskForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired
};

export default TaskForm;
