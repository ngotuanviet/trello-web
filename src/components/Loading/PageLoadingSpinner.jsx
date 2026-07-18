import React from 'react'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PageLoadingSpinner = ({ caption }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100vw', height: '100vh' }}>
      <CircularProgress aria-label="Loading…" />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner