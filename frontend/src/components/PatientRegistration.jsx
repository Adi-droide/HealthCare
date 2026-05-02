import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api';

function PatientRegistration({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '',
    address: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    
    // Emergency contact validation (if provided, should be 10 digits)
    if (formData.emergencyContact && !phoneRegex.test(formData.emergencyContact)) {
      setError('Emergency contact must be 10 digits');
      return false;
    }
    
    // Age validation
    if (formData.age && (formData.age < 0 || formData.age > 150)) {
      setError('Please enter a valid age');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${API}/patients/register`, formData);
      
      if (response.data.success || response.status === 201) {
        setSuccess('Patient registered successfully!');
        // Reset form on success
        setFormData({
          name: '', age: '', gender: 'Male', bloodGroup: 'A+',
          phone: '', address: '', emergencyContact: ''
        });
        if (onSuccess) onSuccess(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3>Register New Patient</h3>
      
      {error && (
        <div style={styles.errorAlert}>
          <span>❌ {error}</span>
          <button onClick={() => setError('')} style={styles.closeBtn}>×</button>
        </div>
      )}
      
      {success && (
        <div style={styles.successAlert}>
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')} style={styles.closeBtn}>×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="age"
          placeholder="Age *"
          value={formData.age}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={styles.input}>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
          <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (10 digits) *"
          value={formData.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          type="tel"
          name="emergencyContact"
          placeholder="Emergency Contact (10 digits)"
          value={formData.emergencyContact}
          onChange={handleChange}
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{
            ...styles.submitButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
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
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '60px',
    fontSize: '14px'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #f5c6cb'
  },
  successAlert: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #c3e6cb'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit'
  }
};

export default PatientRegistration;