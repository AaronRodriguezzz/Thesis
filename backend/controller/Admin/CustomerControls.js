const Customer = require('../../models/CustomerAccount');

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
        const limit = 20;

        // Calculate how many customers to skip
        const skip = (page - 1) * limit;

        // Count total number of customers (for pagination calculation)
        const totalCount = await Customer.countDocuments(); // ❗ Fixed: was mistakenly using Request

        // Fetch customers with pagination, sorted by most recent
        const customers = await Customer.find()
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

module.exports = {
    get_customers,
};
