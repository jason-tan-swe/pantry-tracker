'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, IconButton, useMediaQuery, useTheme, FormControl, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useSession } from "next-auth/react";
import RemoveIcon from '@mui/icons-material/Remove';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { getAllItems, addOrIncrementItem, removeOrDecrementItem } from '@/utils/firebase/pantry';
import { Camera } from 'react-camera-pro';
import axios from 'axios';

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [image, setImage] = useState(null);
  const camera = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;
    fetchItems();
  }, [userEmail]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await getAllItems(userEmail);
      setItems(fetchedItems);
    } catch (err) {
      setError('Failed to fetch items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenOptionsModal = () => setOpenOptionsModal(true);
  const handleCloseOptionsModal = () => setOpenOptionsModal(false);

  const handleAddItem = async () => {
    if (newItemName.trim()) {
      await addOrIncrementItem(userEmail, newItemName.trim());
      setNewItemName('');
      fetchItems();
      handleCloseModal();
    }
  };

  const handleIncrement = async (itemName) => {
    await addOrIncrementItem(userEmail, itemName);
    fetchItems();
  };

  const handleDecrement = async (itemName) => {
    await removeOrDecrementItem(userEmail, itemName);
    fetchItems();
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTakePhoto = async () => {
    setAnalyzing(true);
    try {
      const base64Image = image.split(',')[1];
      
      const response = await axios.post('/api/openrouter/analyze-image', { imageBase64: base64Image });
      const analysis = response.data;
      
      // Save items to Firebase
      for (const item of analysis.items) {
        await addOrIncrementItem(userEmail, item.name, item.quantity);
      }

      // Show success toast
      setToastMessage(`Successfully added ${analysis?.items?.length || 0} item(s) to your pantry!`);

      // Update UI or show success message
      console.log('Items added to pantry:', analysis?.items);
    } catch (error) {
      console.error('Error processing image:', error);
      // Show error toast
      setToastMessage('Error processing image. Please try again.');
    } finally {
      setToastOpen(true);
      setAnalyzing(false);
      setConfirmationModalOpen(false);
      setImage(null);
      fetchItems();
    }
  };

  return (
    <>
    {cameraOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <Camera ref={camera} facingMode="environment" />
          <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => {
                setCameraOpen(false)
                setImage(camera.current.takePhoto())
                setConfirmationModalOpen(true)
              }}
              disabled={analyzing}
              sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
            >
              <CameraAltIcon />
            </IconButton>
            <IconButton 
              onClick={() => {
                camera.current.switchCamera();
              }}
              sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
            >
              <FlipCameraAndroidIcon />
            </IconButton>
          </Box>
        </Box>
    )}
    {!cameraOpen && (
    <Box sx={{ maxWidth: '100%', width: { xs: '100%', sm: '600px' }, margin: 'auto', padding: 2, zIndex: 1 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Pantry Tracker
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search your pantry"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ marginTop: 4, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
          Your Pantry
        </Typography>
        <Button variant="contained" onClick={handleOpenOptionsModal} sx={{ mb: 2 }}>
          Add Item
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      ) : (
        <List>
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <ListItem
              key={item.name}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                padding: { xs: 2, sm: 1 },
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
                sx={{ marginBottom: { xs: 1, sm: 0 } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: { xs: '100%', sm: 'auto' } }}>
                <IconButton onClick={() => handleDecrement(item.name)}>
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={() => handleIncrement(item.name)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </ListItem>
          )) : <Typography variant="caption">
            No items found. Try adding some or adjusting your search!
            </Typography>}
        </List>
      )}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '80%', md: '60%' },
            maxWidth: { sm: '450px', md: '550px' },
            margin: { xs: '16px', sm: '32px' },
            padding: { xs: 2, sm: 3 },
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: { xs: 2, sm: 3 } }}>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openOptionsModal}
        onClose={handleCloseOptionsModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleCloseOptionsModal();
              handleOpenModal();
            }}
            sx={{ mb: 2 }}
          >
            Add Manually
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleCloseOptionsModal();
              setCameraOpen(true);
            }}
          >
            Take a Picture
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Image</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Your image was captured successfully. Would you like to add this item to your pantry?
          </Typography>
          {image && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <img src={image} alt="Captured item" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              handleTakePhoto()
            }} 
            variant="contained"
            disabled={analyzing}
          >
            {analyzing ? <CircularProgress size={24} /> : null}
            Add to Pantry
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastMessage.includes("Error") ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
    )}
    </>
  );
}