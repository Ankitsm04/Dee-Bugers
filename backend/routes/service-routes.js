const express = require('express');
const router = express.Router();
const { createService, getAllServices, getServiceById, updateService, deleteService } = require('../controllers/service-controller');
const authMiddleware = require('../middleware/auth-middleware');  // For protected routes

// Create a new service (Provider only)
router.post('/', authMiddleware, createService);

// Get all services (Public)
router.get('/', getAllServices);

// Get a single service by ID
router.get('/:id', getServiceById);

// Update a service (Provider only)
router.put('/:id', authMiddleware, updateService);

// Delete a service (Provider only)
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;
