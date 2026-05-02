const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Antibiotic', 'Painkiller', 'Antidepressant', 'Antihistamine', 'Vaccine', 'General'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: true
  },
  prescriptionRequired: {
    type: Boolean,
    default: true
  },
  manufacturer: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Generate medicine ID before saving
medicineSchema.pre('save', async function(next) {
  if (!this.medicineId) {
    const count = await mongoose.model('Medicine').countDocuments();
    this.medicineId = `MED${String(count + 1001).slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Medicine', medicineSchema);