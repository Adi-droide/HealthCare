import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5003/api';

function Billing() {
  const [patientId, setPatientId] = useState('');
  const [bills, setBills] = useState([]);
  const [billForm, setBillForm] = useState({ amount: '', items: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchBills = async () => {
    const res = await axios.get(`${API}/billing/patient/${patientId}`);
    setBills(res.data);
  };

  const createBill = async () => {
    const items = billForm.items.split(',').map(item => ({ description: item.trim(), amount: 100 }));
    await axios.post(`${API}/billing/create`, {
      patientId,
      amount: parseFloat(billForm.amount),
      items,
      discount: 0,
      tax: 0
    });
    alert('Bill created!');
    setBillForm({ amount: '', items: '' });
    setShowForm(false);
    fetchBills();
  };

  const processPayment = async (billId, amount) => {
    await axios.put(`${API}/billing/${billId}/pay`, { amount, method: 'cash' });
    alert('Payment processed');
    fetchBills();
  };

  return (
    <div>
      <h2>Billing</h2>
      
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchBills} style={styles.button}>View Bills</button>
        <button onClick={() => setShowForm(!showForm)} style={styles.button}>
          {showForm ? 'Cancel' : 'Create Bill'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h3>Create Bill</h3>
          <input
            type="number"
            placeholder="Amount"
            value={billForm.amount}
            onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Items (comma separated)"
            value={billForm.items}
            onChange={(e) => setBillForm({ ...billForm, items: e.target.value })}
            style={styles.input}
          />
          <button onClick={createBill} style={styles.submitButton}>Generate Bill</button>
          <p style={styles.note}>⚠️ Bug: Allows negative amount</p>
        </div>
      )}

      {bills.length > 0 && (
        <div style={styles.tableContainer}>
          <h3>Bills for Patient: {patientId}</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Bill ID</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.billId}>
                  <td>{bill.billId}</td>
                  <td>₹{bill.amount}</td>
                  <td>{bill.paymentStatus}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>
                    {bill.paymentStatus === 'pending' && (
                      <button onClick={() => processPayment(bill._id, bill.amount)} style={styles.payButton}>
                        Pay Now
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
  input: { padding: '10px', marginRight: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  button: { padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' },
  submitButton: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  payButton: { padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  formContainer: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' },
  tableContainer: { marginTop: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  note: { marginTop: '10px', color: '#dc3545', fontSize: '12px' }
};

export default Billing;