const Service = require('../models/service-model');

// Create a new service (Provider Only)
const createService = async (req, res) => {
    const { title, description, price, image } = req.body;

    // Check for provider role
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: "Only service providers can create services" });
    }

    try {
        const newService = new Service({
            title,
            description,
            price,
            image,
            provider: req.user.userId  // Associate with logged-in provider
        });

        await newService.save();
        res.status(201).json({ message: "Service created successfully", service: newService });

    } catch (error) {
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('provider', 'username email')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'username email' }  // Include review details with user info
            })
            .sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};

// Get single service by ID
const getServiceById = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id).populate('provider', 'username email');

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service", error: error.message });
    }
};

// Update a service (Provider Only)
const updateService = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, image } = req.body;

    try {
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Check if the provider owns the service
        if (service.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to update this service" });
        }

        service.title = title || service.title;
        service.description = description || service.description;
        service.price = price || service.price;
        service.image = image || service.image;

        await service.save();
        res.status(200).json({ message: "Service updated successfully", service });

    } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
    }
};

// Delete a service (Provider Only)
const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Check if the provider owns the service
        if (service.provider.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this service" });
        }

        await service.deleteOne();
        res.status(200).json({ message: "Service deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
