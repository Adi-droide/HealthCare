import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentScheduler from '../components/AppointmentScheduler';

const API = 'http://localhost:5003/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const fetchAppointments = async () => {
    const res = await axios.get(`${API}/appointments/patient/${patientId}`);
    setAppointments(res.data);
  };

  const cancelAppointment = async (id) => {
    await axios.put(`${API}/appointments/${id}/cancel`);
    fetchAppointments();
    alert('Appointment cancelled');
  };

  return (
    <div>
      <h2>Appointment Management</h2>
      
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={styles.input}
        />
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          {showForm ? 'Cancel' : 'Schedule Appointment'}
        </button>
      </div>

      {showForm && <AppointmentScheduler patientId={patientId} onSuccess={fetchAppointments} />}

      {appointments.length > 0 && (
        <div style={styles.tableContainer}>
          <h3>Appointments for Patient: {patientId}</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.appointmentId}>
                  <td>{apt.appointmentId}</td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.department}</td>
                  <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
                  <td>{apt.status}</td>
                  <td>
                    {apt.status === 'scheduled' && (
                      <button onClick={() => cancelAppointment(apt._id)} style={styles.cancelButton}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '200px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
};

export default Appointments;