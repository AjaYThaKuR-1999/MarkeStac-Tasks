const Practitioner = require('../models/practitioner.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Log In a practitioner
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'practitioner' });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'Practitioner not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '11h' });
        return res.status(200).json({ status: 200, message: 'Login successful', user, token });
    } catch (error) {
        console.error('Error logging in practitioner:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

// Sign up a practitioner
const signUpPractitioner = async (req, res) => {
    try {
        const practitionerData = req.body;
        const checkExisiting = await User.findOne({ email: practitionerData.email });
        if (checkExisiting) {
            return res.status(400).json({ status: 400, message: 'email already exists' });
        }
        const hashedPassword = await bcrypt.hash(practitionerData.password, 10);

        const user = await User.create({
            name: practitionerData.nameText,
            email: practitionerData.email,
            password: hashedPassword,
            role: 'practitioner'
        });
        if (!user) {
            return res.status(400).json({ status: 400, message: 'Failed to create user' });
        }
        practitionerData.userId = user._id;
        const newPractitioner = await Practitioner.create(practitionerData);
        if (!newPractitioner) {
            return res.status(400).json({ status: 400, message: 'Failed to create practitioner' });
        }
        return res.status(201).json({ message: 'Practitioner signed up successfully', practitioner: newPractitioner });
    } catch (error) {
        console.error('Error signing up practitioner:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

// Get all practitioners
const getAllPractitioners = async (req, res) => {
    try {
        const practitioners = await Practitioner.find();
        if (!practitioners || practitioners.length === 0) {
            return res.status(404).json({ status: 404, message: 'No practitioners found' });
        }
        return res.status(200).json({ status: 200, practitioners });
    } catch (error) {
        console.error('Error fetching practitioners:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

// Get practitioner by ID
const getPractitionerById = async (req, res) => {
    try {
        const practitionerId = req.params.id;
        const practitioner = await Practitioner.findById(practitionerId);
        if (!practitioner) {
            return res.status(404).json({ status: 404, message: 'Practitioner not found' });
        }
        return res.status(200).json({ status: 200, practitioner });
    } catch (error) {
        console.error('Error fetching practitioner:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};


// Delete practitioner
const deletePractitioner = async (req, res) => {
    try {
        const practitionerId = req.params.id;
        const deletedPractitioner = await Practitioner.findByIdAndDelete(practitionerId);

        if (!deletedPractitioner) {
            return res.status(404).json({ status: 404, message: 'Practitioner not found' });
        }
        return res.status(200).json({ status: 200, message: 'Practitioner deleted successfully' });
    } catch (error) {
        console.error('Error deleting practitioner:', error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    logIn,
    signUpPractitioner,
    getAllPractitioners,
    getPractitionerById,
    deletePractitioner
};