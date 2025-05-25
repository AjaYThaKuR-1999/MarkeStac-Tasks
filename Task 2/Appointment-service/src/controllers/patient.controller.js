const Patient = require('../models/patient.model');

// Add a new patient
const addPatient = async (req, res) => {
    try {
        const patientData = req.body;

        const newPatient = await Patient.create(patientData);
        if (!newPatient) {
            return res.status(400).json({ status: 400, message: 'Failed to create patient' });
        }
        return res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
    } catch (error) {
        console.error('Error adding patient:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

// Get all patients
const getAllPatients = async (req, res) => {
    try {
        let query = {};
        if (req.query.name) {
            query.name = { $regex: new RegExp(req.query.name, 'i') };
        }
        const patients = await Patient.find(query);
        if (!patients || patients.length === 0) {
            return res.status(404).json({ status: 404, message: 'No patients found' });
        }
        return res.status(200).json({ status: 200, patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


module.exports = {
    addPatient,
    getAllPatients,
};