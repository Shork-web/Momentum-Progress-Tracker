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

    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
      padding: '8px 12px',
      fontSize: '0.8rem',
    }
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    }
  },
}));

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ 
        height: '100%',
        width: '100%',
        display: value === index ? 'block' : 'none',
      }}
      {...other}
    >
      {value === index && (
        <Box 
          sx={{ 
            height: '100%',
            width: '100%',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            p: { xs: 1, sm: 2, md: 3 },
            boxSizing: 'border-box'
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

export { StyledTabs, a11yProps };
export default TabPanel;
