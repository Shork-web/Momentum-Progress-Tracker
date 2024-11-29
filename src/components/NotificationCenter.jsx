import React from 'react';
import { Snackbar, IconButton, Typography, Box, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useNotifications } from '../context/NotificationContext';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    border: '1px solid rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(10px)',
  },
}));

function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [currentNotification, setCurrentNotification] = React.useState(null);

  React.useEffect(() => {
    if (notifications.length > 0 && !open) {
      setCurrentNotification(notifications[0]);
      setOpen(true);
    }
  }, [notifications, open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (currentNotification) {
      removeNotification(currentNotification.id);
    }
  };

  const handleExited = () => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setOpen(true);
    }
  };

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      onExited={handleExited}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 400 }}
      sx={{ mt: 2 }}
      message={
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: '300px',
          justifyContent: 'center'
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              color: theme => theme.palette.text.primary
            }}
          >
            {currentNotification?.message}
          </Typography>
        </Box>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
          sx={{
            ml: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

export default NotificationCenter;
