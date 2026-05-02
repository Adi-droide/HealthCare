const Patient = require('../models/Patient');

// Register new patient with duplicate prevention
exports.registerPatient = async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, phone, address, emergencyContact } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and phone number are required' 
      });
    }

    // Check for duplicate patient by phone number
    const existingPatient = await Patient.findOne({ phone });
    
    if (existingPatient) {
      return res.status(400).json({ 
        success: false, 
        message: `Patient already exists with phone number ${phone}. Patient: ${existingPatient.name}` 
      });
    }

    // Create new patient with unique ID
    const patient = new Patient({
      patientId: `PAT${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name,
      age: parseInt(age),
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
      registrationDate: new Date(),
      isActive: true
    });

    await patient.save();

    res.status(201).json({ 
      success: true, 
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient with this phone number already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ registrationDate: -1 });
    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get patient by phone number
exports.getPatientByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found with this phone number'
      });
    }
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If phone number is being updated, check for duplicates
    if (updateData.phone) {
      const existingPatient = await Patient.findOne({ 
        phone: updateData.phone,
        _id: { $ne: id }
      });
      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: 'Another patient already exists with this phone number'
        });
      }
    }
    
    const patient = await Patient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete patient (soft delete - deactivate)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Hard delete patient (permanent removal)
exports.hardDeletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Patient permanently deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { patientId: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active patients only
exports.getActivePatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true }).sort({ registrationDate: -1 });
    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ isActive: true });
    const todayRegistrations = await Patient.countDocuments({
      registrationDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalPatients,
        active: activePatients,
        inactive: totalPatients - activePatients,
        todayRegistrations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};