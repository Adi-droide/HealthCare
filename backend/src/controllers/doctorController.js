const Doctor = require('../models/Doctor');

// Add doctor
exports.addDoctor = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, doctor });
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

// Get available doctors
// BUG: Returns all doctors regardless of actual availability
exports.getAvailableDoctors = async (req, res) => {
  const { date, department } = req.query;
  // BUG: Doesn't check actual appointment availability
  const query = {};
  if (department) query.specialization = department;
  const doctors = await Doctor.find(query);
  res.json(doctors);
};