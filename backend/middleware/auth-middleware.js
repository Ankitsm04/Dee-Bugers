const jwt = require("jsonwebtoken");
const User = require('../models/user-models');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, "SEAD");  // Use your secret key
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Ensure backward compatibility with existing functionality
        req.user = req.user || {};  

        // Add both `userId` and `_id` to maintain compatibility
        req.user.userId = user._id.toString();
        req.user._id = user._id;     // Add `_id` for mongoose references
        req.user.role = user.role;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
