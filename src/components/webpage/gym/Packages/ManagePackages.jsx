import React, { useState } from 'react';
import {
  Box, Typography, Button, /* Paper, */ IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox,
  FormControlLabel /* Removed Card, CardContent, CardActions, Grid */
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'; // Gold (was EmojiEvents)
import DiamondIcon from '@mui/icons-material/Diamond';       // Silver (was StarBorder)
import ShieldIcon from '@mui/icons-material/Shield';          // Black (same)
import HandymanIcon from '@mui/icons-material/Handyman';       // Service (was MiscellaneousServices)
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // None/Day Pass
import styles from './ManagePackages.module.css'; // Import CSS Module

// Mock Data Structure
const initialPackages = [
  { id: 'pkg_gold_001', name: 'Gold Membership', price: 150, entry_limit: null, entry_type: 'unlimited', is_single_use: false, tier: 'gold' },
  { id: 'pkg_silver_002', name: 'Silver Access', price: 100, entry_limit: 12, entry_type: 'monthly', is_single_use: false, tier: 'silver' },
  { id: 'pkg_black_003', name: 'Black VIP', price: 250, entry_limit: null, entry_type: 'unlimited', is_single_use: false, tier: 'black' },
  { id: 'pkg_daypass_004', name: 'Day Pass', price: 20, entry_limit: 1, entry_type: 'total', is_single_use: true, tier: 'none' },
  { id: 'srv_pt_005', name: 'Personal Training Session', price: 80, entry_limit: 1, entry_type: 'total', is_single_use: true, tier: 'service' },
];

const tierIcons = {
  gold: <MilitaryTechIcon sx={{ color: 'gold' }} />,
  silver: <DiamondIcon sx={{ color: '#b0c4de' }} />, // Light Steel Blue for Silver
  black: <ShieldIcon sx={{ color: '#333' }} />,     // Dark Grey/Black
  service: <HandymanIcon sx={{ color: '#8b5cf6' }} />, // Purple (consistent)
  none: <ConfirmationNumberIcon sx={{ color: '#757575' }} />, // Grey for default/day pass
};

const tierBorderClass = {
  gold: styles.tierGold,
  silver: styles.tierSilver,
  black: styles.tierBlack,
  service: styles.tierService,
  none: '',
}

const ManagePackages = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [open, setOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    entry_limit: '', // Use string for TextField, convert later
    entry_type: 'total', // Default type
    is_single_use: false,
    tier: 'none',
  });

  const handleClickOpen = () => {
    setNewPackage({
      name: '', price: '', entry_limit: '', entry_type: 'total', is_single_use: false, tier: 'none',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.price) {
      alert('Numele și prețul pachetului sunt obligatorii.');
      return;
    }
    const newId = `${newPackage.tier}_${newPackage.name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      price: parseFloat(newPackage.price) || 0,
      entry_limit: newPackage.entry_limit === '' || newPackage.entry_limit === null ? null : parseInt(newPackage.entry_limit, 10) || 0,
    };
    setPackages(prev => [...prev, packageToAdd]);
    handleClose();
  };

  const handleEdit = (packageId) => {
    console.log("Edit package:", packageId);
  };

  const handleDelete = (packageId) => {
    console.log("Delete package:", packageId);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
        <Typography variant="h4">
          Gestionare Pachete
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Adaugă Pachet
        </Button>
      </Box>

      {/* Package List using CSS Module styles */}
      <div className={styles.packageList}>
        {packages.length > 0 ? (
            packages.map((pkg) => (
            <div key={pkg.id} className={`${styles.packageItem} ${tierBorderClass[pkg.tier]}`}>
                <div className={styles.packageContent}>
                <div className={styles.packageIcon}>{tierIcons[pkg.tier]}</div>
                <div className={styles.packageDetails}>
                    <div className={styles.packageName}>{pkg.name}</div>
                    <div className={styles.packageMeta}>
                    Limită: {pkg.entry_limit === null ? 'Nelimitat' : pkg.entry_limit} ({pkg.entry_type}) | Single Use: {pkg.is_single_use ? 'Da' : 'Nu'}
                    </div>
                </div>
                <div className={styles.packagePrice}>{pkg.price.toFixed(2)} RON</div>
                <div className={styles.packageActions}>
                    <IconButton size="small" onClick={() => handleEdit(pkg.id)}>
                    <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(pkg.id)}>
                    <DeleteIcon fontSize="small" />
                    </IconButton>
                </div>
                </div>
            </div>
            ))
        ) : (
          <div className={styles.noResults}>Nu există pachete definite.</div>
        )}
      </div>

      {/* Add/Edit Dialog (remains largely the same MUI implementation) */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Adaugă Pachet Nou</DialogTitle>
        <DialogContent>
           {/* Form Fields remain the same */}
           <TextField
             autoFocus
             margin="dense"
             name="name"
             label="Nume Pachet"
             type="text"
             fullWidth
             variant="outlined"
             value={newPackage.name}
             onChange={handleChange}
             required
           />
           <TextField
             margin="dense"
             name="price"
             label="Preț (RON)"
             type="number"
             fullWidth
             variant="outlined"
             value={newPackage.price}
             onChange={handleChange}
             required
             inputProps={{ step: "0.01" }}
           />
            <TextField
             margin="dense"
             name="entry_limit"
             label="Limită Intrări (gol pt. nelimitat)"
             type="number"
             fullWidth
             variant="outlined"
             value={newPackage.entry_limit}
             onChange={handleChange}
             inputProps={{ min: "0" }}
           />
           <FormControl fullWidth margin="dense">
             <InputLabel id="entry-type-label">Tip Limită</InputLabel>
             <Select
               labelId="entry-type-label"
               name="entry_type"
               value={newPackage.entry_type}
               label="Tip Limită"
               onChange={handleChange}
             >
               <MenuItem value="total">Total</MenuItem>
               <MenuItem value="monthly">Lunar</MenuItem>
               <MenuItem value="weekly">Săptămânal</MenuItem>
                <MenuItem value="unlimited">Nelimitat</MenuItem>
             </Select>
           </FormControl>
            <FormControl fullWidth margin="dense">
             <InputLabel id="tier-label">Tier</InputLabel>
             <Select
               labelId="tier-label"
               name="tier"
               value={newPackage.tier}
               label="Tier"
               onChange={handleChange}
             >
               <MenuItem value="none">Day Pass / Altele</MenuItem>
               <MenuItem value="service">Serviciu</MenuItem>
               <MenuItem value="silver">Silver</MenuItem>
               <MenuItem value="gold">Gold</MenuItem>
               <MenuItem value="black">Black</MenuItem>
             </Select>
           </FormControl>
           <FormControlLabel
             control={
               <Checkbox
                 checked={newPackage.is_single_use}
                 onChange={handleChange}
                 name="is_single_use"
               />
             }
             label="Pachet Single Use"
           />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anulează</Button>
          <Button onClick={handleAddPackage} variant="contained">Adaugă</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ManagePackages; 