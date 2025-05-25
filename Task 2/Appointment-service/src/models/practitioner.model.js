const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    use: { type: String, enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'] },
    family: { type: String, required: true },
    given: [{ type: String }],
    prefix: [{ type: String }],
    suffix: [{ type: String }]
});

const telecomSchema = new mongoose.Schema({
    system: { type: String, enum: ['phone', 'email', 'fax', 'pager', 'url', 'sms', 'other'] },
    value: { type: String },
    use: { type: String, enum: ['home', 'work', 'temp', 'old', 'mobile'] },
    rank: { type: Number }
});

const addressSchema = new mongoose.Schema({
    use: { type: String, enum: ['home', 'work', 'temp', 'old', 'billing'] },
    type: { type: String, enum: ['postal', 'physical', 'both'] },
    line: [{ type: String }],
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
});

const identifierSchema = new mongoose.Schema({
    use: { type: String, enum: ['usual', 'official', 'temp', 'secondary', 'old'] },
    system: { type: String },
    value: { type: String }
});

const practitionerSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        default: 'Practitioner'
    },
    identifier: [identifierSchema],
    active: {
        type: Boolean,
        default: true
    },
    name: [nameSchema],
    telecom: [telecomSchema],
    address: [addressSchema],
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'unknown']
    },
    birthDate: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizations',
    }
},
    { timestamps: true, versionKey: false }
);


const Practitioner = mongoose.model('Practitioner', practitionerSchema);

module.exports = Practitioner