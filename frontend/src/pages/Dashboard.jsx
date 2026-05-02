import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  People,
  CalendarToday,
  Receipt,
  LocalPharmacy,
  TrendingUp,
  TrendingDown,
  MoreVert
} from '@mui/icons-material';

const API = 'http://localhost:5003/api';

function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    bills: 0,
    medicines: 0,
    revenue: 0,
    pendingBills: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const patients = await axios.get(`${API}/patients`);
      const appointments = await axios.get(`${API}/appointments/patient/all`);
      const bills = await axios.get(`${API}/billing`);
      const medicines = await axios.get(`${API}/pharmacy/medicines`);
      
      const totalRevenue = bills.data.reduce((sum, b) => b.paymentStatus === 'paid' ? sum + b.amount : sum, 0);
      const pendingBills = bills.data.filter(b => b.paymentStatus === 'pending').length;
      
      setStats({
        patients: patients.data.length,
        appointments: appointments.data.length,
        bills: bills.data.length,
        medicines: medicines.data.length,
        revenue: totalRevenue,
        pendingBills: pendingBills
      });
      
      setRecentAppointments(appointments.data.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Patients', value: stats.patients, icon: <People sx={{ fontSize: 40 }} />, color: '#0d47a1', trend: '+12%' },
    { title: 'Appointments', value: stats.appointments, icon: <CalendarToday sx={{ fontSize: 40 }} />, color: '#00acc1', trend: '+8%' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <Receipt sx={{ fontSize: 40 }} />, color: '#4caf50', trend: '+23%' },
    { title: 'Medicines', value: stats.medicines, icon: <LocalPharmacy sx={{ fontSize: 40 }} />, color: '#ff9800', trend: '+5%' },
  ];

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">{card.trend}</Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Appointments</Typography>
                <IconButton size="small"><MoreVert /></IconButton>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAppointments.map((apt, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{apt.patientName}</TableCell>
                        <TableCell>{apt.doctorName}</TableCell>
                        <TableCell>{apt.department}</TableCell>
                        <TableCell>{new Date(apt.appointmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={apt.status} 
                            size="small"
                            color={apt.status === 'scheduled' ? 'primary' : apt.status === 'completed' ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="body2" color="primary">Pending Bills</Typography>
                  <Typography variant="h3" fontWeight={600}>{stats.pendingBills}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                  <Typography variant="body2" color="warning.main">Today's Appointments</Typography>
                  <Typography variant="h3" fontWeight={600}>0</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;