const User = require('../models/user-models');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt'); 

// Register
const Register = async (req, res) => {
    const { username, email, password, phone, role, services } = req.body;

    try {
        // Validation
        if (!username || !email || !password || !phone || !role) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (!['customer', 'provider'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Choose 'customer' or 'provider'" });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Prepare user data
        const userData = {
            username,
            email,
            phone,
            password,
            role
        };

        // Add services only if the role is 'provider'
        if (role === 'provider' && services && Array.isArray(services)) {
            userData.services = services;
        }

        const userCreated = await User.create(userData);

        res.status(201).json({
            message: "User registered successfully",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
            role: userCreated.role,
            username : username
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Login
const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, userExists.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Return token with role for role-based access
        res.status(200).json({
            message: "Logged in successfully",
            token: await userExists.generateToken(),
            userId: userExists._id.toString(),
            role: userExists.role,
            username : userExists.username
        });

    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            details: error.message,
        });
    }
};

module.exports = { Register, Login };
