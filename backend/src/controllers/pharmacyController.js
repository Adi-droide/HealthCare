const Medicine = require('../models/Medicine');

// Add medicine
// BUG: No expiry date validation
exports.addMedicine = async (req, res) => {
  try {
    const { name, category, stock, price, expiryDate, prescriptionRequired, manufacturer } = req.body;
    
    // BUG: No validation that expiryDate is in future
    const medicine = await Medicine.create({
      name, category, stock, price, expiryDate, prescriptionRequired, manufacturer
    });
    
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
};

// Dispense medicine
// BUG: No check for prescription requirement
exports.dispenseMedicine = async (req, res) => {
  try {
    const { medicineId, quantity, prescriptionAvailable } = req.body;
    const medicine = await Medicine.findById(medicineId);
    
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    // BUG: Even if prescription required and not available, still dispenses!
    if (medicine.stock >= quantity) {
      medicine.stock -= quantity;
      await medicine.save();
      res.json({ success: true, message: 'Medicine dispensed' });
    } else {
      res.status(400).json({ success: false, message: 'Insufficient stock' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  const { stock } = req.body;
  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true }
  );
  res.json(medicine);
};