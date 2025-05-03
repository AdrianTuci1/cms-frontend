import React from 'react';
import { Box, Typography } from '@mui/material';

const ManageStock = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestionare Stoc
      </Typography>
      <Typography>
        Aici vei putea vizualiza și modifica stocul pentru produse (ex: apă, prosoape, etc.).
      </Typography>
      {/* TODO: Implement stock management UI (e.g., table, update forms) */}
    </Box>
  );
};

export default ManageStock; 