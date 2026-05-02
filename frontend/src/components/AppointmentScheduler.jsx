import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api';

function AppointmentScheduler({ patientId, onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    symptoms: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get(`${API}/doctors`);
    setDoctors(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API}/appointments/schedule`, {
        ...formData,
        patientId
      });
      alert('Appointment scheduled successfully!');
      setFormData({ doctorId: '', appointmentDate: '', symptoms: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Schedule failed: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3>Schedule New Appointment</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc.doctorId} value={doc.doctorId}>
              {doc.name} - {doc.specialization} (₹{doc.consultationFee})
            </option>
          ))}
        </select>
        
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <textarea
          name="symptoms"
          placeholder="Describe symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? 'Scheduling...' : 'Schedule Appointment'}
        </button>
      </form>
      <p style={styles.note}>⚠️ Bug: No check for double booking</p>
    </div>
  );
}

const styles = {
  container: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '80px'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  note: {
    marginTop: '10px',
    color: '#dc3545',
    fontSize: '12px'
  }
};

export default AppointmentScheduler;