const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Data encryption and decryption
const { rsaEncryptionMiddleware } = require('./src/middleware/dataEncryption');
app.use(rsaEncryptionMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err });
});

// Importing routes
require('./src/routes/appointment.route')(app);
require('./src/routes/practioner.route')(app);
require('./src/routes/patient.route')(app);

// PORT configuration
const port = process.env.PORT || 6101;

// Health Check Route
app.get('/', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'views', 'healthCheck.html');

    fs.readFile(htmlFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading HTML file', err);
            return res.status(500).send('Server error');
        }
        const replacedHTML = data.replace('<!--PORT_PLACEHOLDER-->', port);
        res.send(replacedHTML);
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// setting up port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

