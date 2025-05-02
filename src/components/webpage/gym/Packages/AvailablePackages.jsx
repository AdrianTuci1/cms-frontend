import React from 'react';
import {
  Box,
  Typography,
  styled,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShieldIcon from '@mui/icons-material/Shield';
import HandymanIcon from '@mui/icons-material/Handyman';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Container = styled(Paper)(({ theme }) => ({
  padding: '24px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  height: '100%',
}));

const PackageList = styled(List)({
  width: '100%',
});

const PackageItem = styled(ListItem)(({ selected }) => ({
  marginBottom: '8px',
  borderRadius: '8px',
  backgroundColor: selected ? '#e3f2fd' : '#f8f9fa',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: selected ? '#e3f2fd' : '#e9ecef',
  },
}));

const subscriptionIcons = {
  gold: <MilitaryTechIcon sx={{ color: 'gold' }} />,
  silver: <DiamondIcon sx={{ color: '#b0c4de' }} />,
  black: <ShieldIcon sx={{ color: '#333' }} />,
  service: <HandymanIcon sx={{ color: '#8b5cf6' }} />,
  none: <ConfirmationNumberIcon sx={{ color: '#757575' }} />,
};

const subscriptionLabels = {
  gold: 'Gold',
  silver: 'Silver',
  black: 'Black',
  service: 'Serviciu',
  none: 'Day Pass',
};

// Mock data - this should come from your backend
const availablePackages = [
  { id: 'pkg_gold_001', name: 'Gold Membership', price: 150, entry_limit: null, entry_type: 'unlimited', tier: 'gold' },
  { id: 'pkg_silver_002', name: 'Silver Access', price: 100, entry_limit: 12, entry_type: 'monthly', tier: 'silver' },
  { id: 'pkg_black_003', name: 'Black VIP', price: 250, entry_limit: null, entry_type: 'unlimited', tier: 'black' },
  { id: 'pkg_daypass_004', name: 'Day Pass', price: 20, entry_limit: 1, entry_type: 'total', tier: 'none' },
  { id: 'srv_pt_005', name: 'Personal Training Session', price: 80, entry_limit: 1, entry_type: 'total', tier: 'service' },
];

const AvailablePackages = ({ selectedPackage, onSelectPackage }) => {
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Pachete Disponibile
      </Typography>
      
      <PackageList>
        {availablePackages.map((pkg) => (
          <PackageItem 
            key={pkg.id}
            selected={selectedPackage?.id === pkg.id}
            onClick={() => onSelectPackage(pkg)}
          >
            <ListItemIcon>
              {subscriptionIcons[pkg.tier]}
            </ListItemIcon>
            <ListItemText
              primary={pkg.name}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={`${pkg.price} RON`}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={pkg.entry_type === 'unlimited' ? 'Acces nelimitat' : 
                           pkg.entry_type === 'monthly' ? `${pkg.entry_limit} intrări/lună` :
                           `${pkg.entry_limit} intrare`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
            />
          </PackageItem>
        ))}
      </PackageList>
    </Container>
  );
};

export default AvailablePackages; 