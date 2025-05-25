const mongoose = require('mongoose');

const codeableConceptSchema = new mongoose.Schema({
    coding: [{
        system: { type: String },
        code: { type: String },
        display: { type: String }
    }],
    text: { type: String }
});

const participantSchema = new mongoose.Schema({
    actor: {
        reference: { type: String, required: true }, // Reference to Patient or Practitioner
        display: { type: String }
    },
    status: {
        type: String,
        enum: ['accepted', 'declined', 'tentative', 'needs-action'],
        required: true
    }
});

const appointmentSchema = new mongoose.Schema({
    resourceType: { type: String, default: 'Appointment' },
    status: {
        type: String,
        enum: ['proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow'],
        required: true
    },
    appointmentType: codeableConceptSchema,
    description: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    participant: [participantSchema], // At least one patient and one practitioner
    created: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true, versionKey: false }
);


const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;