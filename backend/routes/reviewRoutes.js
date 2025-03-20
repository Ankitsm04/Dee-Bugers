const express = require('express');
const router = express.Router();
const { createReview, getReviewsByService, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth-middleware');

// Create a review (requires authentication)
router.post('/:serviceId', authMiddleware, createReview);

// Get all reviews for a specific service
router.get('/:serviceId', getReviewsByService);

// Delete a review (requires authentication)
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
