const Service = require('../../models/Services');

/**
 * @desc Adds a new service
 * @route POST /api/services
 */
const new_service = async (req, res) => {
    const {
        name,
        description,
        duration,
        price,
        serviceType,
    } = req.body;

    try {
        const requiredFields = ['name', 'description', 'duration', 'price', 'serviceType'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });

        if(missingFields.length > 0) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }
        
        const serviceExists = await Service.findOne({
            name: { $regex: `^${name}$`, $options: 'i' }
        });

        if (serviceExists) {
            return res.status(400).json({ message: 'Service already added' });
        }

        const service = new Service({
            name,
            description,
            duration,
            price,
            serviceType,    
        });

        const serviceSaved = await service.save();

        if (!serviceSaved) {
            return res.status(500).json({ message: 'Error saving the new service.' });
        }

        return res.status(200).json({ message: 'New Service Saved', service: serviceSaved });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

/**
 * @desc Updates an existing service
 * @route PUT /api/services
 */
const update_service = async (req, res) => {
    const { id, name, price, duration, description, serviceType } = req.body.newData;

    try {   
        const requiredFields = ['name', 'description', 'duration', 'price', 'serviceType'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body.newData[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });

        console.log(missingFields);

        if(missingFields.length > 0) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const updatedData = { 
            name, 
            price, 
            duration, 
            description, 
            serviceType 
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found or update failed.' });
        }

        return res.status(200).json({ message: 'Update successful', updatedInfo: updatedService });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * @desc Deletes a service by ID
 * @route DELETE /api/services/:id
 */
const delete_service = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        return res.status(200).json({ message: 'Service deleted successfully.', deleted: true});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * @desc Gets paginated list of services
 * @route GET /api/services
 */
const get_services = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const totalCount = await Service.countDocuments(); // Corrected from Request.countDocuments()
        const services = await Service.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const pageCount = Math.ceil(totalCount / limit);

        return res.status(200).json({ services, pageCount });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    new_service,
    update_service,
    delete_service,
    get_services
};
