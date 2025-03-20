const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate accounts
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "provider"], // Role-based access
        required: true
    },
    services: {
        type: [String], // List of services for providers
        default: [] // Empty for customers
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Generate JWT token
userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            userId: this._id.toString(),
            email: this.email,
            role: this.role // Include role for authorization
        },
        "SEAD", // Store this securely in an environment variable
        { expiresIn: "30d" }
    );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
