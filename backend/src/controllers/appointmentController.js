const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Schedule appointment
// BUG: No check for double booking
exports.scheduleAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, symptoms } = req.body;
    
    const patient = await Patient.findOne({ patientId });
    const doctor = await Doctor.findOne({ doctorId });
    
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Patient or Doctor not found' });
    }
    
    // BUG: Doesn't check if doctor already has appointment at same time
    const appointment = await Appointment.create({
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name,
      department: doctor.specialization,
      appointmentDate,
      symptoms
    });
    
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments by patient
exports.getAppointmentsByPatient = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.params.patientId });
  res.json(appointments);
};

// Get appointments by doctor
exports.getAppointmentsByDoctor = async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.params.doctorId });
  res.json(appointments);
};

// Cancel appointment
// BUG: No notification sent to patient
exports.cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );
  // BUG: No email/SMS notification to patient
  res.json({ success: true, appointment });
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(appointment);
};