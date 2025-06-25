const Branch = require('../../models/Branch');


/**
 * @desc Fetch paginated list of customers
 * @route GET /api/branches?page=1
 * @access Admin or Private
 */
const get_branches = async (req, res) => {
    try {
        // Get the current page number from the query; default to 1
        const page = parseInt(req.query.page) || 1;

        // Set how many customers to return per page
        const limit = 10;

        // Calculate how many customers to skip
        const skip = (page - 1) * limit;
 
        // Count total number of customers (for pagination calculation)
        const totalCount = await Branch.countDocuments(); // ❗ Fixed: was mistakenly using Request

        // Fetch customers with pagination, sorted by most recent
        const branches = await Branch.find()
            .sort({ createdAt: -1 }) // Show latest first
            .skip(skip)
            .limit(limit);

        // Calculate total pages needed (rounded up)
        const pageCount = Math.ceil(totalCount / limit);

        console.log("hello", branches);
        // Send customers and pagination info to frontend
        return res.status(200).json({
            branches,
            pageCount
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error fetching customers.' });
    }
};



/**
 * @desc Adds a new branch to the system
 * @route POST /api/add_branch
 * @access Public or Admin (depending on your auth)
 */
const add_new_branch = async (req, res) => {
    const {
        name,
        address,
        phone,
        numberOfBarber
    } = req.body;

    // Basic input validation
    if (!name || !address || !phone || !numberOfBarber) {
        return res.status(400).json({ message: 'Info Incomplete' });
    }

    try {
        // Check for existing branch with the same name
        const branch = await Branch.findOne({ name });

        if (branch) {
            return res.status(409).json({ message: 'Branch Already Exists' });
        }

        // Create a new branch document
        const newBranch = new Branch({ name, address, phone, numberOfBarber });

        // Save the new branch to the database
        const saved_newBranch = await newBranch.save();

        if (!saved_newBranch) {
            return res.status(500).json({ message: 'Failed to save new branch' });
        }

        res.status(201).json({ message: 'New Branch Added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc Updates an existing branch
 * @route PUT /api/edit_branch
 * @access Public or Admin
 */
const update_branch = async (req, res) => {
    const {
        id,
        name,
        address,
        phone,
    } = req.body;

    // Check for required fields
    if (!id || !name || !address || !phone) {
        return res.status(400).json({ message: 'Info Incomplete' });
    }

    try {
        // Update branch by ID
        const branch = await Branch.findByIdAndUpdate(
            id,
            { name, address, phone },
            { new: true } // Return updated document
        );

        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        res.status(200).json({ message: 'Branch Updated Successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc Deletes a branch by ID
 * @route DELETE /api/branch/:id
 * @access Public or Admin
 */
const delete_branch = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the branch
        const deletedBranch = await Branch.findByIdAndDelete(id);

        if (!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found or already deleted' });
        }

        return res.status(200).json({ message: 'Deletion successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Network or service error' });
    }
};

module.exports = {
    get_branches,
    add_new_branch,
    update_branch,
    delete_branch
};
