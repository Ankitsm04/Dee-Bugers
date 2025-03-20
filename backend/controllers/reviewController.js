const Review = require('../models/Review');
const Service = require('../models/service-model');

// Create a new review
const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { serviceId } = req.params;

    try {
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Create the review
        const review = new Review({
            service: serviceId,
            user: req.user._id,  // Attach the user ID
            rating,
            comment
        });

        await review.save();

        // Ensure the review ID is added to the service's reviews array
        service.reviews.push(review._id);
        await service.save();  // Save the service to include the review ID

        res.status(201).json({ message: "Review added successfully", review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all reviews for a service
const getReviewsByService = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const reviews = await Review.find({ service: serviceId })
            .populate('user', 'name')  // Populate user name
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // From auth middleware

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await review.deleteOne();
        res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { createReview, getReviewsByService, deleteReview };