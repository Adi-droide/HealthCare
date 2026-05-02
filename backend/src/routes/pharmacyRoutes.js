const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getAllMedicines,
  dispenseMedicine,
  updateStock
} = require('../controllers/pharmacyController');

router.post('/medicines', addMedicine);
router.get('/medicines', getAllMedicines);
router.post('/dispense', dispenseMedicine);
router.put('/medicines/:id/stock', updateStock);

module.exports = router;