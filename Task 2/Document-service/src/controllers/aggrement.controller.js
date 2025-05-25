const Aggrement = require('../models/aggrement.model');
const Organization = require('../models/organization.model');
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { generateHTML } = require('../aggrementTemplate/template');
const { Aggregate } = require('mongoose');
require('dotenv').config();

// 1. Generate PDF buffer from HTML
async function generatePDF(html) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html);

        const pdfUint8Array = await page.pdf({ format: 'A4' });
        const pdfBuffer = Buffer.from(pdfUint8Array);
        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
}

// 2. Function to authenticate with DocuSign using JWT
async function authenticate() {
    try {
        const SCOPES = ['signature'];
        const apiClient = new docusign.ApiClient();
        apiClient.setBasePath(process.env.DOCUSIGN_API_BASE_PATH);

        // Request JWT User Token
        const results = await apiClient.requestJWTUserToken(
            process.env.DOCUSIGN_CLIENT_ID,
            process.env.DOCUSIGN_USER_ID,
            SCOPES,
            fs.readFileSync(path.join(__dirname, '../../private.secret.key')),
            3600
        );

        const accessToken = results.body.access_token;
        apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
        const userInfo = await apiClient.getUserInfo(accessToken); // Retrieve User Info and Account ID
        const accountId = userInfo.accounts[0].accountId;
        return { apiClient, accountId };
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

// 3. Function to create and send the envelope for signature
async function makeAndSendEnvelope(adminEmail, adminName, clinicEmail, clinicName, pdfBuffer, { apiClient, accountId }) {
    try {
        // Initialize the envelope definition
        const envelopeDefinition = new docusign.EnvelopeDefinition();
        envelopeDefinition.emailSubject = 'Contract Agreement Document';

        // Define the document explicitly
        const documentBase64 = pdfBuffer.toString('base64');
        const document = new docusign.Document();
        document.documentBase64 = documentBase64;
        document.name = 'Contract Agreement Document';
        document.fileExtension = 'pdf';
        document.documentId = '1';
        envelopeDefinition.documents = [document];

        // Define Admin signer
        const adminSigner = new docusign.Signer();
        adminSigner.email = adminEmail;
        adminSigner.name = adminName;
        adminSigner.recipientId = '1';
        adminSigner.routingOrder = '1';

        // Define signature tab for Admin using anchor tag
        const signHereAdmin = new docusign.SignHere();
        signHereAdmin.anchorString = "/AdminSignature";
        signHereAdmin.anchorUnits = "pixels";
        signHereAdmin.anchorYOffset = "10";
        signHereAdmin.anchorXOffset = "0";

        adminSigner.tabs = new docusign.Tabs();
        adminSigner.tabs.signHereTabs = [signHereAdmin];

        // Define Clinic signer
        const clinicSigner = new docusign.Signer();
        clinicSigner.email = clinicEmail;
        clinicSigner.name = clinicName;
        clinicSigner.recipientId = '2';
        clinicSigner.routingOrder = '1';

        // Define signature tab for Clinic using anchor tag
        const signHereClinic = new docusign.SignHere();
        signHereClinic.anchorString = "/ClinicSignature";
        signHereClinic.anchorUnits = "pixels";
        signHereClinic.anchorYOffset = "10";
        signHereClinic.anchorXOffset = "0";

        clinicSigner.tabs = new docusign.Tabs();
        clinicSigner.tabs.signHereTabs = [signHereClinic];

        // Add signers to recipients explicitly
        const recipients = new docusign.Recipients();
        recipients.signers = [adminSigner, clinicSigner];
        envelopeDefinition.recipients = recipients;
        envelopeDefinition.status = 'sent';

        // Send the envelope
        const envelopesApi = new docusign.EnvelopesApi(apiClient);
        const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
        console.log(results);

        return results.envelopeId;
    } catch (error) {
        console.error('Error in makeAndSendEnvelope function:', error);
        throw error;
    }
}

// 4. Generate and send the contract
const generateContract = async (req, res) => {
    try {
        const { adminId, adminEmail, adminName, clinicId, clinicEmail, clinicName } = req.body;

        // Build HTML + PDF
        const html = generateHTML(adminName, clinicName);
        const pdfBuffer = await generatePDF(html);

        // Send to DocuSign
        const auth = await authenticate();
        const envelopeId = await makeAndSendEnvelope(adminEmail, adminName, clinicEmail, clinicName, pdfBuffer, auth);
        if (envelopeId) {
            const contract = await Aggrement.create({
                adminId,
                clinicId,
                envelopeId,
                contractName: 'Contract Agreement Document',
                sentDate: new Date().toISOString().split('T')[0],
            })
            if (contract) {
                await Organization.findByIdAndUpdate(contract.clinicId, { agreementId: contract._id });
            }
        }
        return res.status(200).json({ status: 200, message: 'Contract sent for signature', envelopeId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// 5. Get contract details
const getContractDetails = async (req, res) => {
    try {
        const { clinicId } = req.body;
        const contract = await Aggrement.findOne({ clinicId: clinicId }).sort({ createdAt: -1 })
        if (!contract) {
            return res.status(200).json({ status: 200, message: "Your Contract has not been generated yet" });
        }
        if (contract.contractSignStatus === true || !contract.envelopeId) {
            return res.status(200).json({ status: 200, message: "Contract Fetched successfully", contract });
        }

        const { apiClient, accountId } = await authenticate();
        const envelopesApi = new docusign.EnvelopesApi(apiClient);

        const recipients = await envelopesApi.listRecipients(accountId, contract.envelopeId);
        const signers = recipients.signers;
        console.log(signers);
        
        contract.adminSignStatus = signers[0].status === 'completed';

        contract.clinicSignStatus = signers[1].status === 'completed';

        contract.contractSignStatus = true;

        await contract.save();

        return res.status(200).json({ status: 200, message: "Contract Fetched successfully", contract });
    } catch (error) {
        console.error("Error updating clinics:", error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}



module.exports = {
    generateContract,
    getContractDetails
};