import { Box, Tabs, Tab, styled } from '@mui/material'

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'transparent',
  minHeight: '40px',
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    backgroundColor: '#fff',
  },
  '& .MuiTab-root': {
    minHeight: '40px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.3px',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    
    '&.Mui-selected': {
      color: '#fff',
      fontWeight: 600,
    },
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
  },
}));

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ height: '100%', width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%', width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export { TabPanel as default, StyledTabs, a11yProps }
