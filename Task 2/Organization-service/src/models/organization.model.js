const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    resourceType: { type: String, default: "Organization" },
    identifier: [{
        use: { type: String, enum: ['usual', 'official', 'temp', 'secondary', 'old'] },
        system: { type: String },
        value: { type: String, required: true }
    }],
    active: { type: Boolean, default: true },
    name: { type: String, required: true },
    telecom: [{
        system: {
            type: String,
            enum: ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other']
        },
        value: String,
        use: {
            type: String,
            enum: ['home', 'work', 'temp', 'old', 'mobile']
        }
    }],
    address: [{
        line: [String],
        city: String,
        state: String,
        postalCode: String,
        country: String
    }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    agreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agreement",
    },
},
    { timestamps: true, versionKey: false }
);


const Organization = mongoose.model('Organization', OrganizationSchema);
module.exports = Organization;
