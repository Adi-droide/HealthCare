const express = require('express');
const router = express.Router();
const {
  scheduleAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  cancelAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

router.post('/schedule', scheduleAppointment);
router.get('/patient/:patientId', getAppointmentsByPatient);
router.get('/doctor/:doctorId', getAppointmentsByDoctor);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/status', updateAppointmentStatus);

module.exports = router;