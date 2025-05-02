import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ManagePackages from './ManagePackages';
import ManageStock from './ManageStock';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`packages-tabpanel-${index}`}
      aria-labelledby={`packages-tab-${index}`}
      {...other}
      style={{ height: 'calc(100% - 48px)' }} // Adjust height to account for Tabs height
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `packages-tab-${index}`,
    'aria-controls': `packages-tabpanel-${index}`,
  };
}

const PackagesView = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Packages management tabs">
          <Tab label="Gestionare Pachete" {...a11yProps(0)} />
          <Tab label="Gestionare Stoc" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ManagePackages />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageStock />
      </TabPanel>
    </Box>
  );
};

export default PackagesView; 