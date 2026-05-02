const express = require('express');
const router = express.Router();
const {
  addDoctor,
  getAllDoctors,
  getAvailableDoctors
} = require('../controllers/doctorController');

router.post('/', addDoctor);
router.get('/', getAllDoctors);
router.get('/available', getAvailableDoctors);

module.exports = router;