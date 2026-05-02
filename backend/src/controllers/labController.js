const LabReport = require('../models/LabReport');
const Patient = require('../models/Patient');

// Create lab report
// BUG: No abnormal result flagging
exports.createLabReport = async (req, res) => {
  try {
    const { patientId, testName, result, normalRange, remarks } = req.body;
    
    const patient = await Patient.findOne({ patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    // BUG: No check if result is outside normal range
    const report = await LabReport.create({
      patientId,
      patientName: patient.name,
      testName,
      result,
      normalRange,
      remarks
    });
    
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reports by patient
exports.getReportsByPatient = async (req, res) => {
  const reports = await LabReport.find({ patientId: req.params.patientId });
  res.json(reports);
};

// Update report results
exports.updateReport = async (req, res) => {
  const report = await LabReport.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(report);
};