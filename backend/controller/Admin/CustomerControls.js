const Customer = require('../../models/CustomerAccount');
const mongoose = require('mongoose');

/**
 * @desc Fetch paginated list of customers
 * @route GET /api/customers?page=1
 * @access Admin or Private
 */
const get_customers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';
        const limit = 10;
        const skip = (page - 1) * limit;

        const searchCondition = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },       
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } },
                    { status: { $regex: search, $options: 'i' } },
                ],
            }
        : {};

        const totalCount = await Customer.countDocuments(); 
        const customers = await Customer.find(searchCondition)
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
 * @route GET /api/customers/:email
 * @access Admin or Private
 */
const get_specific_customer = async (req, res) => {
    const email = req.params.email;
 
    try {
        // Fetch customers with pagination, sorted by most recent
        const user = await Customer.findOne({email})

        if(!user){  
            return res.status(400).json({message: 'Finding Customer Email Failed'})
        }

        return res.status(200).json({ user });

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
const disable_customer = async (req, res) => {
    const { id } = req.params 
    const status = req.query.status;

    try {
        
        const disabled = await Customer.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true}
        );

        if(!disabled){
            return res.status(400).json({ message: 'Deletion problem' });
        }
        
        return res.status(200).json({
            message: 'Customer Deleted successfully',
            customer: disabled
        });

    } catch (error) {
        console.error('Update failed:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    get_customers,
    get_specific_customer,
    update_customer,
    disable_customer
};
