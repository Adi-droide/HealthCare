import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api';

function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'General', stock: '', price: '', expiryDate: '', manufacturer: '', prescriptionRequired: true
  });
  const [dispenseData, setDispenseData] = useState({ medicineId: '', quantity: '', prescriptionAvailable: false });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res = await axios.get(`${API}/pharmacy/medicines`);
    setMedicines(res.data);
  };

  const addMedicine = async () => {
    await axios.post(`${API}/pharmacy/medicines`, formData);
    alert('Medicine added!');
    setFormData({ name: '', category: 'General', stock: '', price: '', expiryDate: '', manufacturer: '', prescriptionRequired: true });
    setShowForm(false);
    fetchMedicines();
  };

  const dispenseMedicine = async () => {
    const res = await axios.post(`${API}/pharmacy/dispense`, dispenseData);
    alert(res.data.message);
    fetchMedicines();
  };

  return (
    <div>
      <h2>Pharmacy Inventory</h2>
      
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          {showForm ? 'Cancel' : '+ Add Medicine'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h3>Add New Medicine</h3>
          <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={styles.input}>
            <option>Antibiotic</option><option>Painkiller</option><option>Antidepressant</option><option>Antihistamine</option><option>Vaccine</option><option>General</option>
          </select>
          <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} style={styles.input} />
          <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={styles.input} />
          <input type="date" placeholder="Expiry Date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} style={styles.input} />
          <input placeholder="Manufacturer" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} style={styles.input} />
          <label><input type="checkbox" checked={formData.prescriptionRequired} onChange={(e) => setFormData({...formData, prescriptionRequired: e.target.checked})} /> Prescription Required</label>
          <button onClick={addMedicine} style={styles.submitButton}>Add Medicine</button>
          <p style={styles.note}>⚠️ Bug: No expiry date validation</p>
        </div>
      )}

      <div style={styles.dispenseSection}>
        <h3>Dispense Medicine</h3>
        <select value={dispenseData.medicineId} onChange={(e) => setDispenseData({...dispenseData, medicineId: e.target.value})} style={styles.input}>
          <option value="">Select Medicine</option>
          {medicines.map(m => <option key={m._id} value={m._id}>{m.name} (Stock: {m.stock})</option>)}
        </select>
        <input type="number" placeholder="Quantity" value={dispenseData.quantity} onChange={(e) => setDispenseData({...dispenseData, quantity: e.target.value})} style={styles.input} />
        <label><input type="checkbox" checked={dispenseData.prescriptionAvailable} onChange={(e) => setDispenseData({...dispenseData, prescriptionAvailable: e.target.checked})} /> Prescription Available</label>
        <button onClick={dispenseMedicine} style={styles.dispenseButton}>Dispense</button>
        <p style={styles.note}>⚠️ Bug: Dispenses even without prescription!</p>
      </div>

      <div style={styles.tableContainer}>
        <h3>Medicine Inventory</h3>
        <table style={styles.table}>
          <thead><tr><th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Expiry</th><th>Prescription Required</th></tr></thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td><td>{m.category}</td><td>{m.stock}</td><td>₹{m.price}</td>
                <td>{new Date(m.expiryDate).toLocaleDateString()}</td><td>{m.prescriptionRequired ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  button: { padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  input: { padding: '10px', marginRight: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', width: 'calc(33% - 20px)' },
  submitButton: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' },
  dispenseButton: { padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  formContainer: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' },
  dispenseSection: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff3cd' },
  tableContainer: { marginTop: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  note: { marginTop: '10px', color: '#dc3545', fontSize: '12px' }
};

export default Pharmacy;