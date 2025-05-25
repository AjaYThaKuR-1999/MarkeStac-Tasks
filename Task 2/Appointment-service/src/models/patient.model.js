const mongoose = require('mongoose');
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012'); // 32-byte key
const IV_LENGTH = 16;

// Encryption
function encrypt(value) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), data: encrypted };
}

// Decryption
function decrypt(data, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Hashing
function computeHash(value) {
    return crypto.createHash('sha256').update(value.toLowerCase()).digest('hex');
}

// Schema
const patientSchema = new mongoose.Schema({
    nameHash: { type: String },

    nameEncrypted: {
        iv: { type: String },
        data: { type: String }
    },
    dateOfBirthEncrypted: {
        iv: { type: String },
        data: { type: String }
    },
    addressEncrypted: {
        iv: { type: String },
        data: { type: String }
    },
    contactInformationEncrypted: {
        iv: { type: String },
        data: { type: String }
    },
    medicalHistoryEncrypted: {
        iv: { type: String },
        data: { type: String }
    },
    insuranceDetailsEncrypted: {
        iv: { type: String },
        data: { type: String }
    },

    // Virtual fields (not saved)
    name: { type: String },
    dateOfBirth: { type: Date },
    address: { type: mongoose.Schema.Types.Mixed },
    contactInformation: { type: mongoose.Schema.Types.Mixed },
    medicalHistory: { type: [String] },
    insuranceDetails: { type: mongoose.Schema.Types.Mixed }

}, {
    timestamps: true,
    toJSON: { virtuals: true, transform: decryptTransform },
    toObject: { virtuals: true }
});

//
// Encrypt on save using `pre('validate')`
//
patientSchema.pre('validate', function (next) {
    if (this.name) {
        const enc = encrypt(this.name);
        this.nameEncrypted = enc;
        this.nameHash = computeHash(this.name);
    }
    if (this.dateOfBirth) {
        this.dateOfBirthEncrypted = encrypt(new Date(this.dateOfBirth).toISOString());
    }
    if (this.address) {
        this.addressEncrypted = encrypt(JSON.stringify(this.address));
    }
    if (this.contactInformation) {
        this.contactInformationEncrypted = encrypt(JSON.stringify(this.contactInformation));
    }
    if (this.medicalHistory) {
        this.medicalHistoryEncrypted = encrypt(JSON.stringify(this.medicalHistory));
    }
    if (this.insuranceDetails) {
        this.insuranceDetailsEncrypted = encrypt(JSON.stringify(this.insuranceDetails));
    }
    next();
});

//
// Auto-decrypt on toJSON
//
function decryptTransform(doc, ret) {
    const decryptField = (encrypted) => {
        if (!encrypted?.data || !encrypted?.iv) return null;
        return decrypt(encrypted.data, encrypted.iv);
    };

    ret.name = decryptField(ret.nameEncrypted);
    ret.dateOfBirth = decryptField(ret.dateOfBirthEncrypted);
    ret.address = JSON.parse(decryptField(ret.addressEncrypted) || '{}');
    ret.contactInformation = JSON.parse(decryptField(ret.contactInformationEncrypted) || '{}');
    ret.medicalHistory = JSON.parse(decryptField(ret.medicalHistoryEncrypted) || '[]');
    ret.insuranceDetails = JSON.parse(decryptField(ret.insuranceDetailsEncrypted) || '{}');

    // Remove encrypted fields
    delete ret.nameEncrypted;
    delete ret.dateOfBirthEncrypted;
    delete ret.addressEncrypted;
    delete ret.contactInformationEncrypted;
    delete ret.medicalHistoryEncrypted;
    delete ret.insuranceDetailsEncrypted;
    delete ret.__v;
    delete ret.nameHash;

    return ret;
}

module.exports = mongoose.model('Patient', patientSchema);
