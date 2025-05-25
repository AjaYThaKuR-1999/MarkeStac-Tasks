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

require('./src/routes/aggrement.route')(app);

// https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=639ebfc8-afae-44c1-9770-a7955bbf4d9a&redirect_uri=http://localhost:6102/callback

// const CLIENT_ID = '639ebfc8-afae-44c1-9770-a7955bbf4d9a';
// const CLIENT_SECRET = '5611bdd1-a63d-421c-82db-f08475d9b230';
// const REDIRECT_URI = 'http://localhost:6102/callback';
// const AUTH_SERVER = 'https://account-d.docusign.com';
// const axios = require('axios');
// // Step 1: Start OAuth Authorization by redirecting to DocuSign's auth URL
// app.get('/auth', (req, res) => {
//     const authUrl = `${AUTH_SERVER}/oauth/auth?response_type=code&scope=signature&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
//     res.redirect(authUrl);
// });

// // https://account-d.docusign.com/oauth/auth
// //   ? response_type = code
// //     & scope=signature % 20impersonation
// //     & client_id='639ebfc8-afae-44c1-9770-a7955bbf4d9a'
// //             & redirect_uri=https % 3A % 2F % 2Fwww.docusign.com
// // Step 2: Handle the redirect with authorization code
// app.get('/callback', async (req, res) => {
//     const authCode = req.query.code;
//     if (!authCode) {
//         return res.send('Authorization code not found.');
//     }

//     // Step 3: Exchange authorization code for access token
//     try {
//         const tokenResponse = await axios.post(
//             `${AUTH_SERVER}/oauth/token`,
//             new URLSearchParams({
//                 grant_type: 'authorization_code',
//                 code: authCode,
//                 redirect_uri: REDIRECT_URI,
//             }),
//             {
//                 headers: {
//                     Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//         const accessToken = tokenResponse.data.access_token;
//         console.log('Access Token:', accessToken, '----------------------------------');

//         // Respond with the access token for testing purposes
//         res.send(`Access Token: ${accessToken}`);
//     } catch (error) {
//         console.error('Error exchanging authorization code for access token:', error.response?.data || error.message);
//         res.send('Failed to exchange authorization code for access token. Check the console for details.');
//     }
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err });
});

// PORT configuration
const port = process.env.PORT || 6102;

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

