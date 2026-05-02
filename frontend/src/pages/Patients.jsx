import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const API = 'http://localhost:5003/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '', 
    age: '', 
    gender: 'Male', 
    bloodGroup: 'A+', 
    phone: '', 
    address: '', 
    emergencyContact: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/patients`);
      
      // Handle different response structures
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setPatients(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
      } else {
        setPatients([]);
        console.warn('Unexpected API response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to fetch patients', 
        severity: 'error' 
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.age) errors.age = 'Age is required';
    if (formData.age && (formData.age < 0 || formData.age > 150)) errors.age = 'Enter valid age';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (formData.phone && !phoneRegex.test(formData.phone)) errors.phone = 'Phone number must be 10 digits';
    if (formData.emergencyContact && !phoneRegex.test(formData.emergencyContact)) {
      errors.emergencyContact = 'Emergency contact must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix form errors', severity: 'error' });
      return;
    }
    
    setSubmitLoading(true);
    try {
      const response = await axios.post(`${API}/patients/register`, formData);
      
      if (response.data.success || response.status === 201) {
        setSnackbar({ open: true, message: 'Patient registered successfully!', severity: 'success' });
        fetchPatients(); // Refresh the list
        setOpenDialog(false);
        resetForm();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', age: '', gender: 'Male', bloodGroup: 'A+', 
      phone: '', address: '', emergencyContact: ''
    });
    setFormErrors({});
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${API}/patients/${patientId}`);
        setSnackbar({ open: true, message: 'Patient deleted successfully', severity: 'success' });
        fetchPatients();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete patient', severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Patient Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 8, px: 3 }}
        >
          Register Patient
        </Button>
      </Box>

      <Card>
        <CardContent>
          {patients.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="text.secondary">
                No patients registered yet. Click "Register Patient" to add your first patient.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Patient ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Age/Gender</strong></TableCell>
                    <TableCell><strong>Blood Group</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Registration Date</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient._id || patient.patientId} hover>
                      <TableCell>
                        <Chip 
                          label={patient.patientId} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age} yrs / {patient.gender}</TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {new Date(patient.registrationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="info">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(patient._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Register New Patient
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              fullWidth 
              label="Full Name *" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            <TextField 
              fullWidth 
              type="number" 
              label="Age *" 
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              error={!!formErrors.age}
              helperText={formErrors.age}
              required
            />
            <TextField 
              select 
              fullWidth 
              label="Gender" 
              value={formData.gender} 
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField 
              select 
              fullWidth 
              label="Blood Group" 
              value={formData.bloodGroup} 
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              label="Phone Number (10 digits) *" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              required
            />
            <TextField 
              fullWidth 
              multiline 
              rows={2} 
              label="Address" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <TextField 
              fullWidth 
              label="Emergency Contact (10 digits)" 
              value={formData.emergencyContact} 
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              error={!!formErrors.emergencyContact}
              helperText={formErrors.emergencyContact}
            />
            
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={submitLoading} 
              sx={{ mt: 2, py: 1.5 }}
            >
              {submitLoading ? 'Registering...' : 'Register Patient'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Patients;