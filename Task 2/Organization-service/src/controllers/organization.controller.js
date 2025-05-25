const Organization = require('../models/organization.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// LogIn
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const organization = await User.findOne({ email });
        if (!organization) {
            return res.status(404).json({ status: 404, message: "Organization not found" });
        }
        const isPasswordValid = organization.password === password;
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid password" });
        }
        // Generate JWT token        
        const token = jwt.sign({ id: organization._id, role: 'organization' }, process.env.JWT_SECRET, { expiresIn: '11h' });

        return res.status(200).json({ status: 200, message: "Login successful", organization, token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

// Sign up a new organization
const signUp = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ status: 400, message: "This Email already exists" });
        }
        const newUser = await User.create({
            role: 'organization',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        if (!newUser) {
            return res.status(500).json({ status: 500, message: "Failed to create user" });
        }
        req.body.userId = newUser._id;
        const result = await Organization.create(req.body);
        return res.status(201).json({ status: 201, message: "Organization created successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

module.exports = {
    logIn,
    signUp
};