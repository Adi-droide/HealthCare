const express = require('express');
const router = express.Router();
const {
  createLabReport,
  getReportsByPatient,
  updateReport
} = require('../controllers/labController');

router.post('/reports', createLabReport);
router.get('/patient/:patientId', getReportsByPatient);
router.put('/reports/:id', updateReport);

module.exports = router;