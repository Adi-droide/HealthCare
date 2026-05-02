const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    unique: true
  },
  patientId: {
    type: String,
    required: true,
    ref: 'Patient'
  },
  patientName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'insurance'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'insurance'],
    default: 'cash'
  },
  paymentDate: {
    type: Date
  },
  items: [{
    description: String,
    amount: Number
  }],
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Generate bill ID before saving
billSchema.pre('save', async function(next) {
  if (!this.billId) {
    const count = await mongoose.model('Bill').countDocuments();
    this.billId = `BIL${String(count + 1001).slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);