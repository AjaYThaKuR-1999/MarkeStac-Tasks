const mongoose = require('mongoose');
const { Schema } = mongoose;

const aggrementSchema = new mongoose.Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'adminId is required']
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'ClinicId is required']
    },
    envelopeId: {
        type: String,
        // required: [true, 'EnvelopeId is required']
    },
    contractName: {
        type: String
    },
    sentDate: {
        type: String,
    },
    contractSignStatus: {
        type: Boolean,
        default: false
    },
    adminSignStatus: {
        type: Boolean,
        default: false
    },
    clinicSignStatus: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true, versionKey: false }
);

const Agreements = mongoose.model('Agreements', aggrementSchema);

module.exports = Agreements;
