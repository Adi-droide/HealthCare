const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  reportId: {
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
  testName: {
    type: String,
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  result: {
    type: String,
    required: true
  },
  normalRange: {
    type: String,
    required: true
  },
  isAbnormal: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

// Generate report ID before saving
labReportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await mongoose.model('LabReport').countDocuments();
    this.reportId = `LAB${String(count + 1001).slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('LabReport', labReportSchema);