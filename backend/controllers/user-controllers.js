const User = require('../models/user-models');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt'); 
const Service = require('../models/service-model');
const Review = require('../models/Review');

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

const getUserProfile = async (req, res) =>{
    try {
        const userId = req.user.userId;  // Get user ID from token
        const user = await User.findById(userId).select('-password');  // Exclude the password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let profileData = {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        };

        // If the user is a provider
        if (user.role === 'provider') {
            // Fetch services provided by the provider
            const services = await Service.find({ provider: userId })
                .populate({
                    path: 'reviews',
                    populate: { path: 'user', select: 'username email' }
                });

            profileData.services = services.map(service => ({
                _id: service._id,
                title: service.title,
                description: service.description,
                price: service.price,
                image: service.image,
                createdAt: service.createdAt,
                reviews: service.reviews.map(review => ({
                    _id: review._id,
                    rating: review.rating,
                    comment: review.comment,
                    user: review.user
                }))
            }));

            // Fetch reviews written by the provider (as a customer)
            const reviewsGiven = await Review.find({ user: userId })
                .populate({
                    path: 'service',
                    select: 'title description price'
                });

            profileData.reviewsGiven = reviewsGiven.map(review => ({
                _id: review._id,
                rating: review.rating,
                comment: review.comment,
                service: {
                    _id: review.service._id,
                    title: review.service.title,
                    description: review.service.description,
                    price: review.service.price
                }
            }));

        // If the user is a customer
        } else {
            const reviews = await Review.find({ user: userId })
                .populate({
                    path: 'service',
                    select: 'title description price'
                });

            profileData.reviews = reviews.map(review => ({
                _id: review._id,
                rating: review.rating,
                comment: review.comment,
                service: {
                    _id: review.service._id,
                    title: review.service.title,
                    description: review.service.description,
                    price: review.service.price
                }
            }));
        }

        res.status(200).json(profileData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}

module.exports = { Register, Login, getUserProfile };
