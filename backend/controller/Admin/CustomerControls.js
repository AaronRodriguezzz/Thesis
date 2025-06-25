const Customer = require('../../models/CustomerAccount');
const mongoose = require('mongoose');

/**
 * @desc Fetch paginated list of customers
 * @route GET /api/customers?page=1
 * @access Admin or Private
 */
const get_customers = async (req, res) => {
    try {
        // Get the current page number from the query; default to 1
        const page = parseInt(req.query.page) || 1;

        // Set how many customers to return per page
        const limit = 10;

        // Calculate how many customers to skip
        const skip = (page - 1) * limit;

        // Count total number of customers (for pagination calculation)
        const totalCount = await Customer.countDocuments(); // ❗ Fixed: was mistakenly using Request

        // Fetch customers with pagination, sorted by most recent
        const customers = await Customer.find()
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }) // Show latest first
            .skip(skip)
            .limit(limit);

        // Calculate total pages needed (rounded up)
        const pageCount = Math.ceil(totalCount / limit);

        // Send customers and pagination info to frontend
        return res.status(200).json({
            customers,
            pageCount
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error fetching customers.' });
    }
};


/**
 * @desc Fetch paginated list of customers
 * @route PUT /api/update_customer
 * @access Admin or Private
 */
const update_customer = async (req, res) => {
    const { id, firstName, lastName, email, phone, status } = req.body.newData;

    const updateData = {
        firstName,
        lastName,
        email,
        phone,
        status
    };

    try {
        const duplicate = await Customer.findOne({ 
            email: email,
            _id: { $ne: id }
        });
        if (duplicate) {
            return res.status(400).json({ message: 'Phone or email already in use by another customer.' });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        
        console.log(updatedCustomer)
        return res.status(200).json({
            message: 'Customer updated successfully',
            customer: updatedCustomer
        });

    } catch (error) {
        console.error('Update failed:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Fetch paginated list of customers
 * @route DELETE /api/delete_customer
 * @access Admin or Private
 */
const delete_customer = async (req, res) => {
    const { id } = req.params 

    try {
        
        const deleted_customer = await Customer.findByIdAndDelete(id);

        if(!deleted_customer){
            return res.status(400).json({ message: 'Deletion problem' });
        }
        
        return res.status(200).json({
            message: 'Customer Deleted successfully',
            deleted: true
        });

    } catch (error) {
        console.error('Update failed:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    get_customers,
    update_customer,
    delete_customer
};
