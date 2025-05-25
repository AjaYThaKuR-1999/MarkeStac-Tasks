const Appointment = require('../models/appointment.model');
const mongoose = require('mongoose');

// Utility to check doctor availability
const isDoctorAvailable = async (doctorRef, start, end) => {
    const overlappingAppointments = await Appointment.find({
        'participant.actor.reference': doctorRef,
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) },
        status: { $in: ['booked', 'arrived', 'fulfilled'] }
    });
    return overlappingAppointments.length === 0;
};

// Create an appointment
exports.createAppointment = async (req, res) => {
    try {
        const { status, appointmentType, description, start, end, participant } = req.body;

        const hasPatient = participant.some(p => p.actor.reference.startsWith('Patient/'));
        const hasDoctor = participant.some(p => p.actor.reference.startsWith('Practitioner/'));

        if (!hasPatient || !hasDoctor) {
            return res.status(400).json({ message: 'Appointment must include one patient and one doctor.' });
        }

        const doctor = participant.find(p => p.actor.reference.startsWith('Practitioner/'));
        const available = await isDoctorAvailable(doctor.actor.reference, start, end);
        if (!available) {
            return res.status(409).json({ message: 'Doctor is not available during the requested time.' });
        }

        const appointment = new Appointment({
            status,
            appointmentType,
            description,
            start,
            end,
            participant
        });

        await appointment.save();
        return res.status(201).json({ status: 201, message: 'Appointment created', appointment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: err.message });
    }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        return res.status(200).json({ status : 200, message : "Listed all appointments", appointments });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        return res.status(200).json({ status: 200, message: "Appointment Details fetched", appointments });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
};


// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        return res.status(200).json({ status: 200, message: "Appointment Deleted" });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
};


// Get appointments for a specific patient
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const patientId = req.params.patientId; // Just the ID, not "Patient/<id>"
        const patientReference = `Patient/${patientId}`;

        const appointments = await Appointment.find({
            'participant.actor.reference': patientReference
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this patient' });
        }

        return res.status(200).json({ status: 200, message: "Listed all appointments", appointments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: err.message });
    }
};
  