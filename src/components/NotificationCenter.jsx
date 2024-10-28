import React, { useEffect, useState } from 'react'
import { Snackbar, IconButton, Typography, Box, Fade } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
  },
}))

function NotificationCenter({ notifications, setNotifications }) {
  const [open, setOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(null)

  useEffect(() => {
    if (notifications.length > 0 && !open) {
      setCurrentNotification(notifications[0])
      setOpen(true)
    }
  }, [notifications, open])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    // Remove the current notification immediately
    setNotifications(prev => prev.slice(1))
  }

  const handleExited = () => {
    // This will be called after the fade-out animation is complete
    if (notifications.length > 0) {
      setCurrentNotification(notifications[0])
      setOpen(true)
    }
  }

  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      onExited={handleExited}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      message={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
            Notification:
          </Typography>
          <Typography variant="body2">{currentNotification?.message}</Typography>
        </Box>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  )
}

export default NotificationCenter
