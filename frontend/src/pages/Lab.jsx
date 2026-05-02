import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api';

function Lab() {
  const [patientId, setPatientId] = useState('');
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    testName: '', result: '', normalRange: '', remarks: ''
  });

  const fetchReports = async () => {
    const res = await axios.get(`${API}/lab/patient/${patientId}`);
    setReports(res.data);
  };

  const createReport = async () => {
    await axios.post(`${API}/lab/reports`, { ...formData, patientId });
    alert('Lab report created!');
    setFormData({ testName: '', result: '', normalRange: '', remarks: '' });
    setShowForm(false);
    fetchReports();
  };

  return (
    <div>
      <h2>Lab Reports</h2>
      
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchReports} style={styles.button}>View Reports</button>
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          {showForm ? 'Cancel' : 'Create Report'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h3>Create Lab Report</h3>
          <input placeholder="Test Name" value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})} style={styles.inputFull} />
          <input placeholder="Result Value" value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} style={styles.inputFull} />
          <input placeholder="Normal Range (e.g., 70-100 mg/dL)" value={formData.normalRange} onChange={(e) => setFormData({...formData, normalRange: e.target.value})} style={styles.inputFull} />
          <textarea placeholder="Remarks" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} style={styles.textarea} />
          <button onClick={createReport} style={styles.submitButton}>Generate Report</button>
          <p style={styles.note}>⚠️ Bug: Abnormal results not flagged</p>
        </div>
      )}

      {reports.length > 0 && (
        <div style={styles.tableContainer}>
          <h3>Lab Reports for Patient: {patientId}</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Report ID</th><th>Test Name</th><th>Result</th><th>Normal Range</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.reportId}>
                  <td>{r.reportId}</td>
                  <td>{r.testName}</td>
                  <td style={!isInRange(r.result, r.normalRange) ? styles.abnormal : {}}>{r.result}</td>
                  <td>{r.normalRange}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.testDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const isInRange = (result, normalRange) => {
  // Simple check for demonstration
  if (!normalRange) return true;
  const match = normalRange.match(/(\d+(?:\.\d+)?)/g);
  if (!match) return true;
  const numResult = parseFloat(result);
  const min = parseFloat(match[0]);
  const max = match[1] ? parseFloat(match[1]) : Infinity;
  return numResult >= min && numResult <= max;
};

const styles = {
  input: { padding: '10px', marginRight: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '200px' },
  inputFull: { padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' },
  textarea: { padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', minHeight: '80px' },
  button: { padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
  submitButton: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' },
  formContainer: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' },
  tableContainer: { marginTop: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  abnormal: { color: '#dc3545', fontWeight: 'bold', backgroundColor: '#ffebee' },
  note: { marginTop: '10px', color: '#dc3545', fontSize: '12px' }
};

export default Lab;