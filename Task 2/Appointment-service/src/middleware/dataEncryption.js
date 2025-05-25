const NodeRSA = require('node-rsa');
require('dotenv').config();

// Helper: Normalize PEM (trim indentation)
const normalizePem = (pem) => pem.split('\n').map(line => line.trim()).join('\n');

// Load keys
const privateKey = new NodeRSA();
privateKey.importKey(normalizePem(process.env.PRIVATE_KEY), 'pkcs1-private');

const publicKey = new NodeRSA();
publicKey.importKey(normalizePem(process.env.PUBLIC_KEY), 'pkcs1-public');

// Encryption function
const encrypt = (text) => {
    try {
        return publicKey.encrypt(text, 'base64');
    } catch (err) {
        console.error('RSA encryption failed:', err.message);
        throw new Error('Encryption failed');
    }
};

// Decryption function
const decrypt = (encryptedText) => {
    try {
        return privateKey.decrypt(encryptedText, 'utf8');
    } catch (err) {
        console.error('RSA decryption failed:', err.message);
        throw new Error('Decryption failed');
    }
};

// Express middleware
const rsaEncryptionMiddleware = (req, res, next) => {
    const encryptedPayload = req.body?.data || req.body?.encrypted;
    console.log('Encrypted payload:', encryptedPayload);

    if (encryptedPayload) {
        try {
            // Decrypt and convert to utf-8 string
            const decrypted = decrypt(encryptedPayload).toString('utf-8');
            console.log('Decrypted string:', decrypted);

            // Parse JSON
            req.body = JSON.parse(decrypted);
            console.log('Parsed req.body:', req.body);
            next();
        } catch (err) {
            console.error('Decryption error:', err);
            return res.status(400).json({ error: 'Invalid encrypted input' });
        }
    }

    // Intercept outgoing responses
    const originalJson = res.json;
    res.json = function (body) {
        try {
            const encrypted = encrypt(JSON.stringify(body));
            return originalJson.call(this, { data: encrypted });
        } catch (err) {
            return originalJson.call(this, { error: 'Response encryption failed' });
        }
    };

    next();
};

module.exports = { encrypt, decrypt, rsaEncryptionMiddleware };
