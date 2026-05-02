const express = require('express');
const router = express.Router();
const {
  createBill,
  getBillsByPatient,
  getBillById,
  processPayment
} = require('../controllers/billingController');

router.post('/create', createBill);
router.get('/patient/:patientId', getBillsByPatient);
router.get('/:id', getBillById);
router.put('/:id/pay', processPayment);

module.exports = router;