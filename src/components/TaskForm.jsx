import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme,
  styled
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, #2c2c2c 30%, #3a3a3a 90%)'
      : 'linear-gradient(145deg, #f0f0f0 30%, #ffffff 90%)',
    borderRadius: theme.spacing(2),
    boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.1)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.spacing(1),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0ea5e9',
        borderWidth: 2,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: '#0ea5e9',
    },
  },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    cursor: 'pointer',
    filter: theme.palette.mode === 'dark' ? 'invert(0.8)' : 'none',
    opacity: theme.palette.mode === 'dark' ? 0.8 : 0.6,
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
      opacity: 1,
      transform: 'scale(1.1)',
    },
  },
  '& input[type="date"]::-webkit-clear-button': {
    display: 'none',
  },
  '& input[type="date"]': {
    color: theme.palette.text.primary,
    '&::-webkit-datetime-edit': {
      paddingLeft: 0,
    },
    '&::-webkit-datetime-edit-fields-wrapper': {
      padding: 0,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.spacing(1),
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    },
  },
  '&.Mui-focused': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0ea5e9',
      borderWidth: 2,
    },
  },
}));

function TaskForm({ open, onClose, onAddTask }) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
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
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        color: theme.palette.text.primary,
        fontWeight: 600,
        px: 3,
        pt: 3,
      }}>
        Add New Task
      </DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            mt: 1
          }}
        >
          <StyledTextField
            autoFocus
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <StyledTextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ 
              color: theme.palette.text.secondary,
              '&.Mui-focused': {
                color: '#0ea5e9',
              },
            }}>
              Priority
            </InputLabel>
            <StyledSelect
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </StyledSelect>
          </FormControl>
          <StyledTextField
            type="date"
            label="Due Date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#0ea5e9',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#0284c7',
            }
          }}
        >
          Add Task
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

TaskForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
};

export default TaskForm;
