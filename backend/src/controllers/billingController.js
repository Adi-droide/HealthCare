const Bill = require('../models/Bill');
const Patient = require('../models/Patient');

// Create bill
// BUG: Allows negative amount
exports.createBill = async (req, res) => {
  try {
    const { patientId, amount, items, discount, tax } = req.body;
    
    // BUG: No validation that amount cannot be negative
    const patient = await Patient.findOne({ patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    const netAmount = amount + tax - discount;
    // BUG: netAmount could be negative!
    
    const bill = await Bill.create({
      patientId,
      patientName: patient.name,
      amount,
      items,
      discount,
      tax
    });
    
    res.status(201).json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bills by patient
exports.getBillsByPatient = async (req, res) => {
  const bills = await Bill.find({ patientId: req.params.patientId });
  res.json(bills);
};

// Get bill by ID
exports.getBillById = async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  res.json(bill);
};

// Process payment
// BUG: Partial payment not tracked properly
exports.processPayment = async (req, res) => {
  const { amount, method } = req.body;
  const bill = await Bill.findById(req.params.id);
  
  // BUG: If amount is less than bill amount, status remains 'pending'
  // No tracking of how much paid vs remaining
  if (amount >= bill.amount) {
    bill.paymentStatus = 'paid';
    bill.paymentMethod = method;
    bill.paymentDate = new Date();
  }
  await bill.save();
  
  res.json({ success: true, bill });
};